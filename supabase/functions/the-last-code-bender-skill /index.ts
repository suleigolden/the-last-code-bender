import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const handle = url.searchParams.get('handle')

  if (!handle) {
    return new Response(
      JSON.stringify({ error: 'handle required' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data } = await supabase
    .from('benders')
    .select('cached_skill, skill_downloads')
    .eq('handle', handle)
    .eq('skill_live', true)
    .maybeSingle()

  if (!data?.cached_skill) {
    return new Response('Not found', { status: 404, headers: corsHeaders })
  }

  void supabase
    .from('benders')
    .update({ skill_downloads: (data.skill_downloads ?? 0) + 1 })
    .eq('handle', handle)

  const identityMatch = data.cached_skill.match(/## Identity\n+([\s\S]+?)(?=\n## |$)/)
  const description =
    identityMatch?.[1]?.split('\n').find((l: string) => l.trim())?.trim() ??
    `Claude Code skill for @${handle}`

  const frontmatter = `---\nname: ${handle}\ndescription: "${description.replace(/"/g, '\\"')}"\n---\n\n`
  const skillContent = frontmatter + data.cached_skill

  return new Response(skillContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="SKILL.md"`,
      ...corsHeaders,
    },
  })
})
