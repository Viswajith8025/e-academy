
import { createClient } from '@supabase/supabase-js'

const url = 'https://krlrndkahzakovtwhwwl.supabase.co'
const key = 'sb_publishable_2roXExTBKeQjfUcJ7v7jfg_AI6q2Y5-'

async function checkDB() {
  const supabase = createClient(url, key)
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) {
    console.error(error)
    return
  }
  console.log(JSON.stringify(data, null, 2))
}

checkDB()
