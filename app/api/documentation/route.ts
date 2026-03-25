import { NextRequest, NextResponse } from 'next/server';
import { generateClinicalDocument } from '@/lib/ai/documentation-assistant';

export async function POST(req: NextRequest) {
  const { documentType, providerRole, providerName, providerLicense, patientName, visitData, state } = await req.json();

  if (!visitData?.trim()) {
    return NextResponse.json({ error: 'Visit data is required.' }, { status: 400 });
  }

  const document = await generateClinicalDocument({
    documentType: documentType || 'SOAP_NOTE',
    providerRole:  providerRole || 'PHYSICIAN',
    providerName:  providerName || 'Dr. Castillo',
    providerLicense,
    patientName:   patientName || 'Patient',
    visitData,
    state:         state || 'CA',
  });

  return NextResponse.json({ document });
}
