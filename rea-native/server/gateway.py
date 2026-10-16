#!/usr/bin/env python3
"""One native MCP endpoint for the bounded workbench and unchanged REA engine.

Only the pinned, separately approved launcher can start an engine. Targets are
never launched here. Engine tool schemas/results and bidirectional JSON-RPC
messages are preserved; the five integration tools precede the engine catalog.
"""
import asyncio
import json
from pathlib import Path
import sys

import workbench

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / 'plugin.json').read_text())['version']
STATUS = workbench.tool('plugin_status',
    'Return the exact installed skill path, plugin version, engine readiness and tool counts. Use this to resolve stale host skill paths; no target read or execution.', {}, [])
ENTRY = workbench.tool('a_rebuild',
    'REA Native workflow entry point: route_target, inspect_local, prepare_build, assess_parity or plugin_status. '
    'Use this single tool when the host exposes only a prefix of the full engine catalog. '
    'The installed skill is at ' + str(ROOT / 'skills/rebuild-with-rea/SKILL.md') + '. '
    'A route does not inspect or execute a target; prepare_build returns evidence-linked contracts; '
    'assess_parity accounts for supplied logs and never upgrades static checks to runtime parity.',
    {'action': {'type': 'string', 'enum': ['route_target', 'inspect_local', 'prepare_build', 'assess_parity', 'plugin_status']},
     'target': workbench.STR, 'evidence': workbench.EVIDENCE, 'features': workbench.FEATURES,
     'improvements': workbench.IMPROVEMENTS, 'specification': {'type': 'object'}, 'results': workbench.RESULTS}, ['action'])
LOCAL_TOOLS = [ENTRY, STATUS, *workbench.TOOLS]
LOCAL_NAMES = {t['name'] for t in LOCAL_TOOLS}


class Gateway:
    def __init__(self, command=None):
        # Explicit constructor injection is for authored protocol tests only.
        # There is no environment/config option for arbitrary engine commands.
        self.command = command or [sys.executable, str(ROOT / 'scripts/launch_rea.py')]
        self.engine = None
        self.reader_task = None
        self.init_task = None
        self.params = {}
        self.capabilities = {'tools': {}}
        self.pending = {}
        self.host_requests = {}
        self.engine_requests = {}
        self.sequence = 0
        self.engine_error = None
        self.engine_version = None
        self.engine_tool_count = None
        self.engine_evidence = set()
        self.tasks = set()

    def emit(self, message):
        print(json.dumps(message, ensure_ascii=False), flush=True)

    async def send_engine(self, message):
        if not self.engine or self.engine.returncode is not None:
            raise RuntimeError('REA engine is not connected. Use plugin_status and the packaged setup instructions.')
        self.engine.stdin.write((json.dumps(message) + '\n').encode())
        await self.engine.stdin.drain()

    async def request_engine(self, method, params, host_id=None):
        self.sequence += 1
        rid = 'rea-native-out:' + str(self.sequence)
        future = asyncio.get_running_loop().create_future()
        self.pending[rid] = future
        if host_id is not None:
            self.host_requests[host_id] = rid
        try:
            await self.send_engine({'jsonrpc': '2.0', 'id': rid, 'method': method, 'params': params})
            return await future
        finally:
            self.pending.pop(rid, None)
            if host_id is not None:
                self.host_requests.pop(host_id, None)

    async def read_engine(self):
        try:
            while line := await self.engine.stdout.readline():
                message = json.loads(line)
                if 'method' in message:
                    if 'id' in message:
                        # Relay engine requests to the host without granting
                        # sampling, elicitation, execution or access ourselves.
                        self.sequence += 1
                        rid = 'rea-native-in:' + str(self.sequence)
                        self.engine_requests[rid] = message['id']
                        self.emit({**message, 'id': rid})
                    else:
                        self.emit(message)
                elif message.get('id') in self.pending:
                    future = self.pending[message['id']]
                    if not future.done():
                        future.set_result(message)
        except (ValueError, OSError, asyncio.LimitOverrunError) as e:
            self.engine_error = 'Engine transport failed: ' + str(e)
        finally:
            self.engine_error = self.engine_error or 'REA engine disconnected.'
            error = RuntimeError(self.engine_error)
            for future in list(self.pending.values()):
                if not future.done():
                    future.set_exception(error)

    async def initialize_engine(self):
        try:
            self.engine = await asyncio.create_subprocess_exec(*self.command,
                stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE,
                stderr=None, limit=64 * 1024 * 1024)
            self.reader_task = asyncio.create_task(self.read_engine())
            result = await asyncio.wait_for(self.request_engine('initialize', self.params), timeout=20)
            if 'error' in result:
                raise RuntimeError(str(result['error']))
            info = result['result']
            self.engine_version = info.get('serverInfo', {}).get('version')
            self.capabilities = {**info.get('capabilities', {}), 'tools': info.get('capabilities', {}).get('tools', {})}
            await self.send_engine({'jsonrpc': '2.0', 'method': 'notifications/initialized'})
            return info
        except (OSError, ValueError, KeyError, RuntimeError, asyncio.TimeoutError) as e:
            self.engine_error = 'Approved REA runtime unavailable: ' + (str(e) or type(e).__name__)
            return None

    async def ensure_engine(self):
        if self.init_task is None:
            self.init_task = asyncio.create_task(self.initialize_engine())
        return await self.init_task

    def status(self):
        return {'plugin': 'rea-native', 'version': VERSION,
            'plugin_root': str(ROOT),
            'skill_path': str(ROOT / 'skills/rebuild-with-rea/SKILL.md'),
            'engine': {'connected': bool(self.engine_version and not self.engine_error),
                'version': self.engine_version, 'tool_count': self.engine_tool_count,
                'error': self.engine_error},
            'workbench_tools': [t['name'] for t in workbench.TOOLS],
            'endpoint': 'rea', 'target_execution': 'none',
            'setup_instructions': str(ROOT / 'docs/INSTALL.md')}

    def remember_evidence(self, value):
        if isinstance(value, dict):
            for key, item in value.items():
                if key in {'evidence_id', 'parent_evidence_id'} and isinstance(item, str):
                    self.engine_evidence.add(item)
                elif isinstance(item, (dict, list)):
                    self.remember_evidence(item)
        elif isinstance(value, list):
            for item in value:
                self.remember_evidence(item)

    async def dispatch(self, request):
        method = request.get('method')
        params = request.get('params', {})
        if not isinstance(params, dict):
            raise ValueError('MCP params must be an object.')
        if method == 'initialize':
            self.params = params
            upstream = await self.ensure_engine()
            protocol = (upstream or {}).get('protocolVersion', '2025-06-18')
            return {'protocolVersion': protocol, 'capabilities': self.capabilities,
                'serverInfo': {'name': 'rea-native', 'version': VERSION},
                'instructions': 'REA Native combines workbench and original REA tools in this one endpoint. '
                    'Read the installed rebuild-with-rea skill at ' + str(ROOT / 'skills/rebuild-with-rea/SKILL.md') + '. '
                    'Use plugin_status if host skill paths are stale. Begin with route_target, inspect evidence, '
                    'prepare_build, implement and test, then assess_parity. Source-derived tests are not runtime parity.'
                    + (' Engine unavailable: ' + self.engine_error if self.engine_error else '')
                    + ('\n' + upstream['instructions'] if upstream and upstream.get('instructions') else '')}
        if method == 'ping':
            return {}
        if method == 'tools/list':
            await self.ensure_engine()
            local = [] if params.get('cursor') else LOCAL_TOOLS
            if self.engine_error:
                return {'tools': local}
            result = await self.request_engine(method, params, request['id'])
            if 'error' in result:
                return result
            data = result['result']
            names = {t['name'] for t in data['tools']}
            if names & LOCAL_NAMES:
                raise ValueError('Engine/workbench tool name collision; refusing ambiguous routing.')
            self.engine_tool_count = len(data['tools'])
            return {**data, 'tools': [*local, *data['tools']]}
        if method == 'tools/call' and params.get('name') in LOCAL_NAMES:
            if params['name'] == 'a_rebuild':
                args = params.get('arguments', {})
                if not isinstance(args, dict) or args.get('action') not in {'plugin_status', *workbench.HANDLERS}:
                    raise ValueError('Select one advertised workbench action.')
                action = args['action']
                return await self.dispatch({**request, 'params': {'name': action,
                    'arguments': {k: v for k, v in args.items() if k != 'action'}}})
            if params['name'] == 'plugin_status':
                if not isinstance(params.get('arguments', {}), dict) or params.get('arguments', {}):
                    raise ValueError('plugin_status takes no arguments.')
                result = self.status()
                return {'content': [{'type': 'text', 'text': json.dumps(result)}], 'structuredContent': result}
            if params['name'] == 'prepare_build':
                args = params.get('arguments', {})
                if isinstance(args, dict) and 'target' in args:
                    route = workbench.route_target(args['target'])
                    if route['kind'] in {'javascript-application', 'electron-asar'} and not any(
                            e.get('id') in self.engine_evidence for e in args.get('evidence', []) if isinstance(e, dict)):
                        return {'isError': True, 'content': [{'type': 'text', 'text':
                            'This route requires original REA JavaScript artifact evidence before the build handoff. '
                            'Call analyze_javascript_application on the supplied target with detail="summary" and focused source_paths, '
                            'then link an actual returned evidence_id or parent_evidence_id in prepare_build. '
                            'Static workbench inventory/source-derived tests alone do not establish that REA analyzed the artifact. '
                            'If the engine is unavailable, report the engine-backed handoff blocked and continue authorized independent work.'}]}
            return workbench.dispatch(request)
        await self.ensure_engine()
        if self.engine_error:
            if method == 'tools/call':
                return {'isError': True, 'content': [{'type': 'text', 'text': self.engine_error}]}
            raise RuntimeError(self.engine_error)
        response = await self.request_engine(method, params, request['id'])
        if method == 'tools/call' and not response.get('error'):
            result = response.get('result', {})
            if not result.get('isError'):
                self.remember_evidence(result.get('structuredContent', {}))
                for content in result.get('content', []):
                    if content.get('type') == 'text':
                        try:
                            self.remember_evidence(json.loads(content['text']))
                        except (ValueError, KeyError):
                            pass
        return response

    async def handle(self, request):
        try:
            result = await self.dispatch(request)
            # Forward JSON-RPC errors from original engine unchanged.
            if isinstance(result, dict) and result.get('jsonrpc') == '2.0':
                self.emit({**result, 'id': request['id']})
            else:
                self.emit({'jsonrpc': '2.0', 'id': request['id'], 'result': result})
        except (ValueError, TypeError, KeyError, OSError, RuntimeError) as e:
            self.emit({'jsonrpc': '2.0', 'id': request.get('id'),
                'error': {'code': -32603, 'message': str(e)}})

    async def receive(self, request):
        if not isinstance(request, dict) or request.get('jsonrpc') != '2.0':
            self.emit({'jsonrpc': '2.0', 'id': None, 'error': {'code': -32600, 'message': 'Expected a JSON-RPC 2.0 object.'}})
        elif 'method' not in request and request.get('id') in self.engine_requests:
            original_id = self.engine_requests.pop(request['id'])
            await self.send_engine({**request, 'id': original_id})
        elif 'id' not in request:
            if self.engine and not self.engine_error and request.get('method') != 'notifications/initialized':
                params = request.get('params', {})
                if request.get('method') == 'notifications/cancelled' and params.get('requestId') in self.host_requests:
                    request = {**request, 'params': {**params, 'requestId': self.host_requests[params['requestId']]}}
                await self.send_engine(request)
        else:
            task = asyncio.create_task(self.handle(request))
            self.tasks.add(task)
            task.add_done_callback(self.tasks.discard)

    async def close(self):
        for task in list(self.tasks):
            task.cancel()
        if self.engine and self.engine.returncode is None:
            self.engine.terminate()
            try:
                await asyncio.wait_for(self.engine.wait(), timeout=3)
            except asyncio.TimeoutError:
                self.engine.kill()
                await self.engine.wait()
        if self.reader_task:
            self.reader_task.cancel()


async def serve(command=None):
    gateway = Gateway(command)
    try:
        while line := await asyncio.to_thread(sys.stdin.buffer.readline, workbench.MAX_REQUEST + 1):
            if len(line) > workbench.MAX_REQUEST:
                while line and not line.endswith(b'\n'):
                    line = await asyncio.to_thread(sys.stdin.buffer.readline, workbench.MAX_REQUEST + 1)
                gateway.emit({'jsonrpc': '2.0', 'id': None,
                    'error': {'code': -32600, 'message': 'Request exceeds the 2 MiB admission limit.'}})
                continue
            try:
                await gateway.receive(json.loads(line))
            except (ValueError, TypeError) as e:
                gateway.emit({'jsonrpc': '2.0', 'id': None, 'error': {'code': -32700, 'message': str(e)}})
    finally:
        await gateway.close()


if __name__ == '__main__':
    asyncio.run(serve())
