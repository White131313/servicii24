
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pnefpdiloblajeyxkmdl.supabase.co';
const supabaseKey = 'sb_publishable_Q01mzxUgs-P7vIxnD2TlZQ__BBslzH_'; // Using the one from env

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    console.log("Checking Supabase counts...");

    // 1. Get raw counts
    const { count: totalCount, error: errTotal } = await supabase.from('providers').select('*', { count: 'exact', head: true });
    const { count: roCount, error: errRo } = await supabase.from('providers').select('*', { count: 'exact', head: true }).eq('language', 'ro');
    const { count: huCount, error: errHu } = await supabase.from('providers').select('*', { count: 'exact', head: true }).eq('language', 'hu');

    if (errTotal || errRo || errHu) {
        console.error("Error fetching counts:", errTotal, errRo, errHu);
        return;
    }

    console.log(`Total Rows in DB: ${totalCount}`);
    console.log(`Rows with language='ro': ${roCount}`);
    console.log(`Rows with language='hu': ${huCount}`);

    // 2. Fetch all RO data to simulate client-side deduplication
    const { data: allRo } = await supabase.from('providers').select('*').eq('language', 'ro');

    // Simulate the deduplication logic from page.tsx
    const uniqueRo = (allRo || []).reduce((acc, current) => {
        const normalize = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
        const isDuplicate = acc.some(item =>
            (
                normalize(item.name) === normalize(current.name) ||
                (item.phone && current.phone && item.phone.replace(/\D/g, '') === current.phone.replace(/\D/g, ''))
            ) &&
            normalize(item.category) === normalize(current.category)
        );
        if (!isDuplicate) acc.push(current);
        return acc;
    }, []);

    console.log(`\n--- RO Analysis ---`);
    console.log(`Raw RO Rows: ${allRo.length}`);
    console.log(`Displayed (Unique) RO: ${uniqueRo.length}`);
    console.log(`Hidden by Deduplication: ${allRo.length - uniqueRo.length}`);

    // 3. Fetch all HU data
    const { data: allHu } = await supabase.from('providers').select('*').eq('language', 'hu');
    const uniqueHu = (allHu || []).reduce((acc, current) => {
        const normalize = (str) => str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
        const isDuplicate = acc.some(item =>
            (
                normalize(item.name) === normalize(current.name) ||
                (item.phone && current.phone && item.phone.replace(/\D/g, '') === current.phone.replace(/\D/g, ''))
            ) &&
            normalize(item.category) === normalize(current.category)
        );
        if (!isDuplicate) acc.push(current);
        return acc;
    }, []);

    console.log(`\n--- HU Analysis ---`);
    console.log(`Raw HU Rows: ${allHu.length}`);
    console.log(`Displayed (Unique) HU: ${uniqueHu.length}`);
    console.log(`Hidden by Deduplication: ${allHu.length - uniqueHu.length}`);

}

checkCounts();
