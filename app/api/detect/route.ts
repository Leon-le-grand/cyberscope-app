import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

interface CMSPattern {
  metaTags: { selector: string; value: string }[];
  urlPatterns: string[];
  headers: { name: string; value: string }[];
  cookies: string[];
}

interface Fingerprints {
  [key: string]: CMSPattern;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain || !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
    return NextResponse.json({ error: 'Valid domain is required (e.g., example.com)' }, { status: 400 });
  }

  let fingerprints: Fingerprints;
  try {
    const filePath = path.join(process.cwd(), 'cms-fingerprints.json');
    fingerprints = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch (error) {
    console.error('Failed to load fingerprints:', error);
    return NextResponse.json({ error: 'Failed to load CMS fingerprints file' }, { status: 500 });
  }

  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CMSDetector/1.0)' },
      maxRedirects: 5,
      timeout: 10000,
    });
    const html = response.data;
    const headers = response.headers;
    const $ = cheerio.load(html);
    let matches: { cms: string; confidence: number; evidence: string[] }[] = [];

    // Log debugging info
    console.log(`Analyzing ${domain}`);
    console.log('Meta tags found:', $('meta[name="generator"]').map((i, el) => $(el).attr('content')).get());
    console.log('Headers:', headers);
    console.log('Cookies:', headers['set-cookie'] || 'None');

    for (const cms of Object.keys(fingerprints)) {
      let matchCount = 0;
      const evidence: string[] = [];

      // Check meta tags
      for (const meta of fingerprints[cms].metaTags) {
        if ($(meta.selector).length > 0) {
          const content = $(meta.selector).attr('content') || '';
          if (content.includes(meta.value)) {
            matchCount++;
            evidence.push(`Meta tag: ${meta.selector} contains "${meta.value}"`);
          }
        }
      }

      // Check URLs
      for (const pattern of fingerprints[cms].urlPatterns) {
        if (html.includes(pattern)) {
          matchCount++;
          evidence.push(`URL pattern: ${pattern}`);
        }
      }

      // Check headers
      for (const header of fingerprints[cms].headers) {
        if (headers[header.name]?.toLowerCase().includes(header.value.toLowerCase())) {
          matchCount++;
          evidence.push(`Header: ${header.name} contains "${header.value}"`);
        }
      }

      // Check cookies
      if (headers['set-cookie']) {
        const cookies = Array.isArray(headers['set-cookie'])
          ? headers['set-cookie']
          : [headers['set-cookie']];
        for (const cookie of fingerprints[cms].cookies) {
          if (cookies.some((c) => c.includes(cookie))) {
            matchCount++;
            evidence.push(`Cookie: ${cookie}`);
          }
        }
      }

      if (matchCount > 0) {
        matches.push({
          cms,
          confidence: Math.min(0.3 * matchCount, 1),
          evidence,
        });
      }
    }

    matches.sort((a, b) => b.confidence - a.confidence);
    const result = matches[0] || { cms: null, confidence: 0, evidence: ['No CMS detected'] };
    console.log('Detection result:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Failed to analyze domain:', error.message);
    return NextResponse.json({ error: `Failed to fetch or analyze the website: ${error.message}` }, { status: 500 });
  }
}