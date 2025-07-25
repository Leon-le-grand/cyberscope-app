import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');

  // Validate input (basic sanitization)
  if (!target || !/^[a-zA-Z0-9.-]+$/.test(target)) {
    return NextResponse.json({ error: 'Valid IP or domain required (e.g., scanme.nmap.org)' }, { status: 400 });
  }

  try {
    // Run Nmap command: Fast scan (-F) with version detection (-sV)
    const nmapCommand = `nmap -F -sV ${target}`;
    console.log(`Executing: ${nmapCommand}`);
    const { stdout, stderr } = await execPromise(nmapCommand);

    if (stderr) {
      console.error('Nmap error:', stderr);
    }

    // Parse Nmap output (basic parsing for demo)
    const results = {
      target,
      output: stdout,
      openPorts: stdout
        .split('\n')
        .filter((line) => line.includes('/tcp') && line.includes('open'))
        .map((line) => {
          const [port, state, service] = line.split(/\s+/).filter(Boolean);
          return { port: port.split('/')[0], state, service };
        }),
    };

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Scan error:', error.message);
    return NextResponse.json({ error: `Failed to scan: ${error.message}` }, { status: 500 });
  }
}