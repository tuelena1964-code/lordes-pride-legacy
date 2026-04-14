const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RECIPIENT_EMAIL = "tuchkova-64@mail.ru";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, city, phone, experience, looking_for, lifestyle, about } = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Имя и телефон обязательны' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailBody = `
Новая заявка с сайта Lordes Pride

Имя: ${name}
Город: ${city || '—'}
Телефон: ${phone}
Опыт содержания собак: ${experience || '—'}
Кого ищет: ${looking_for || '—'}
Образ жизни: ${lifestyle || '—'}
О себе: ${about || '—'}

Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
    `.trim();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Lordes Pride <onboarding@resend.dev>',
          to: [RECIPIENT_EMAIL],
          subject: 'Новая заявка с сайта Lordes Pride',
          text: emailBody,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Resend error:', errText);
      }
    } else {
      console.log('No RESEND_API_KEY configured. Email content:');
      console.log(emailBody);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
