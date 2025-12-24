const supabase = require('../config/supabase');
const {enums} = require('../consts');

exports.sendRequest = async (req, res) => {
    
    const { targetUserID } = req.body;
    const currentUserID = req.user.id;

    if (targetUserID === currentUserID) {
        return res.status(400).json({error: 'Trying to befriend yourself'});
    } 
    const { data: existing, error: checkError } = await supabase
    .from('friendships')
    .select('*')
    .or(`and(user_id_1.eq.${currentUserID},user_id_2.eq.${targetUserID},and(user_id_1.eq.${targetUserID},user_id_2.eq.${currentUserID}`);

    if (existing && existing.lenght > 0) {
        return res.status(400).json({checkError: 'Already friends'});
    }

    const { data, error} = await supabase
    .from('friendships')
    .insert([{user_id_1: currentUserID, user_id_2: targetUserID, status: 'PENDING'}])
    .select();

    if (error) return res.status(500).json({error: error.message});
    
    res.status(201).json({message: `Friend request from ${currentUserID} sent to ${targetUserID}`});
}

exports.acceptRequest = async (req, res) => {
    
    const { requestID } = req.body;
    const currentUserID = req.user.id;

    const { data, error } = await supabase
    .from('friendships')
    .update({status: enums.DB_ENUM_FRIENDSHIP_STATUS_ACCEPTED})
    .eq('id', requestID)
    .eq('status', enums.DB_ENUM_FRIENDSHIP_STATUS_PENDING)
    .eq('user_id_2', currentUserID)
    .select();

    if (error) return res.status(500).json({error: error.message});
    if (data.length === 0) return res.status(404).json({error: `Request not found for user ${currentUserID}`});

    res.json({message: `Friend request accepted for ${currentUserID}`});
}

exports.removeFriend = async (req, res) => {

    // friendship row id
    const {id} = req.params;
    const currentUserID = req.user.id;

    const { data, error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', id)
    .or(`user_id_1.eq.${currentUserID}, user_id_2.eq.${currentUserID}`);

    if (error) return res.status(500).json({error: error.message});
    
    res.json({message: 'Friendship removed'});
}

exports.getFriends = async (req, res) => {
    
    const currentUserID = req.user.id;

    const {data, error} = await supabase
    .from('friendships')
    .select('id, status, user_id_1, user_id_2')
    .or(`user_id_1.eq.${currentUserID}, user_id_2.eq.${currentUserID}`)
    .eq('status', enums.DB_ENUM_FRIENDSHIP_STATUS_ACCEPTED);

    if (error) return res.status(500).json({error: error.message});
    const friendIDs = data ? data.map(f => f.user_id_1 === currentUserID ? f.user_id_2 : f.user_id_1) : [];
    if (friendIDs.lenght === 0) return res.json({friends: []});

    const {data: profiles} = await supabase
    .from('profiles')
    .select('*')
    .in('id', friendIDs);
 
    res.json({friends: profiles});
}