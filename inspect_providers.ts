import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data, error } = await supabase.from('providers').select('id, name, category, language').limit(20)
  if (error) {
    console.error(error)
  } else {
    console.log('Sample Providers:')
    console.table(data)
    
    // Check distinct languages
    const { data: langs } = await supabase.from('providers').select('language')
    const uniqueLangs = [...new Set(langs?.map(l => l.language))]
    console.log('Unique Languages:', uniqueLangs)
  }
}

main()
