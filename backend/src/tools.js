

const supabase = require('./config/supabase');
const testUsers = [
    {
        email: process.env.TEST_1_EMAIL,
        password: process.env.TEST_1_PASSWORD,
        uuid: process.env.TEST_1_UUID
    },
    {
        email: process.env.TEST_2_EMAIL,
        password: process.env.TEST_2_PASSWORD,
        uuid: process.env.TEST_2_UUID
}];

const getToken = async (userIdx) =>{

    if (userIdx >= 2){
        console.log('invalid test user idx, try 0 or 1');
        return;
    }
    const {data, error} = await supabase.auth.signInWithPassword({
        email: testUsers[userIdx].email,
        password: testUsers[userIdx].password
    });
    
    if (!error || data.session) {
        console.log(`\n👇 COPY THIS TOKEN FOR TEST ${userIdx} 👇\n`);
        console.log(data.session.access_token);
        console.log("\n👆 ---------------- 👆\n");
        return data.session.access_token;
    }
}

if (require.main === module) {
    // defaulted to user 0
    getToken(0); 
}

module.exports = getToken;  