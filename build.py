#!/usr/bin/env python3
"""Build original Linux DOOM plus browser platform, using emcc on PATH."""
import os, re, subprocess
from pathlib import Path
root = Path(__file__).resolve().parent
os.chdir(root)
files = re.findall(r'\$\(O\)/(\w+)\.o', (root/'src/Makefile').read_text())
files = list(dict.fromkeys(files))
files = [n for n in files if n not in ('i_video','i_sound','i_net')]
files += ['i_web']
(root/'dist').mkdir(exist_ok=True)
cmd = ['emcc', *['src/'+n+'.c' for n in files], '-Isrc', '-O2', '-std=gnu11',
       '-DNORMALUNIX', '-DLINUX', '-DSNDSRV', '-fno-common',
       '-Wno-error=implicit-function-declaration', '-Wno-error=incompatible-function-pointer-types',
       '-Wno-error=implicit-int', '-Wno-int-conversion', '-Wno-pointer-sign',
       '-sASYNCIFY=1', '-sASYNCIFY_STACK_SIZE=65536', '-sSTACK_SIZE=2097152',
       '-sALLOW_MEMORY_GROWTH=1', '-sINITIAL_MEMORY=67108864', '-sEXIT_RUNTIME=0',
       '-sMODULARIZE=1', '-sEXPORT_NAME=createDoom', '-sENVIRONMENT=web,node',
       '-sEXPORTED_FUNCTIONS=["_main","_doom_key","_doom_mouse"]',
       '--preload-file', 'doom1.wad@/doom1.wad', '-o', 'dist/doom.js']
subprocess.run(cmd, check=True)
