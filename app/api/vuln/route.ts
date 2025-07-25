import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import validator from 'validator';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');

  // Validate input
  if (!target || !(validator.isIP(target) || validator.isFQDN(target))) {
    return NextResponse.json({ error: 'Valid IP or domain required (e.g., scanme.nmap.org)' }, { status: 400 });
  }

  try {
    // Run Nikto command: Basic scan with max time of 120 seconds
    const niktoPath = '/usr/bin/nikto'; // Adjust if needed (e.g., /usr/share/nikto/nikto.pl)
    const niktoCommand = `${niktoPath} -h ${target} -maxtime 120 -output - -Format json`;
    console.log(`Executing: ${niktoCommand}`);
    const { stdout, stderr } = await execPromise(niktoCommand);

    if (stderr) {
      console.error('Nikto error:', stderr);
    }

    // Parse Nikto JSON output
    let vulnerabilities = [];
    try {
      const output = JSON.parse(stdout);
      vulnerabilities = output.vulnerabilities || [];
    } catch (parseError) {
      console.error('Failed to parse Nikto JSON:', parseError);
      // Fallback to basic text parsing
      vulnerabilities = stdout
        .split('\n')
        .filter(line => line.includes('OSVDB') || line.includes('vulnerability') || line.includes('misconfiguration'))
        .map(line => ({ description: line }));
    }

    const results = {
      target,
      vulnerabilities,
      rawOutput: stdout,
    };

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Vuln scan error:', error.message);
    return NextResponse.json({ error: `Failed to scan: ${error.message}` }, { status: 500 });
  }
}
