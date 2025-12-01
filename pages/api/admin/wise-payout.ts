import type { NextApiRequest, NextApiResponse } from 'next';

// Mock handler for POST /api/admin/wise-payout
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, currency, recipientName, accountNumber } = req.body;

    console.log('Received wise payout request:', { amount, currency, recipientName, accountNumber });

    // Return a mock success response with a mock transferId
    res.status(200).json({
      success: true,
      transferId: 'mock-transfer-id-12345',
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
