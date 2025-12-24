const supabase = require('../config/supabase');
const {enums} = require('../consts');

exports.createItem = async (req, res) => {

    const { name, type } = req.body;
    const currentUserID = req.user.id;

    if (!name || !type) return res.status(400).json({error: 'Item must have name and type'});

    const {data, error} = await supabase
    .from('items')
    .insert([{owner_id: currentUserID, name, type, status: enums.DB_ENUM_STATUS_AVAILABLE}])
    .select();

    if (error) return res.status(500).json({error: error.message});
    res.status(201).json({message: "Item created", item: data[0]});
}

exports.getItems = async (req, res) => {

    const currentUserID = req.user.id;

    const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('owner_id', currentUserID)
    .order('created_at', {ascending: false});

    if (error) return res.status(500).json({error: error.message});
    res.status(201).json({items: data});
}

exports.lendItem = async (req, res) => {

    const {itemID, targetUserID} = req.body;
    const currentUserID = req.user.id;

    const { data: item, error: itemError } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemID)
    .eq('owner_id', currentUserID)
    .single();

    if (!item)      return res.status(404).json({error: `Item ${itemID} not found`});
    if (item.status == enums.DB_ENUM_STATUS_LENT) return res.status(400).json({error: `Item ${itemID} already lent out`});

    const {data: friendship, error: friendshipError} = await supabase
    .from('friendships')
    .select('*')
    .eq('status', enums.DB_ENUM_FRIENDSHIP_STATUS_ACCEPTED)
    .or(`and(user_id_1.eq.${currentUserID},user_id_2.eq.${targetUserID}),and(user_id_1.eq.${targetUserID},user_id_2.eq.${currentUserID})`)
    .single()

    if (!friendship)      return res.status(400).json({error: `Current user ${currentUserID} and target user ${targetUserID} are not friends 🥲`});

    const {data: updatedItem, error: updateError} = await supabase
    .from('items')
    .update({status: enums.DB_ENUM_STATUS_LENT, lent_to: targetUserID})
    .eq('id', itemID)
    .select();

    if (updateError)    return res.status(500).json({error: updateError.message});
    res.json({message: `Item ${itemID} successfully lent to: ${targetUserID}`, item: updatedItem[0]});
}

exports.returnItem = async (req, res) => {

    const {itemID} = req.body;
    const currentUserID = req.user.id;

    const { data, error } = await supabase
    .from('items')
    .update({status: enums.DB_ENUM_STATUS_AVAILABLE, lent_to: null})
    .eq('id', itemID)
    .eq('lent_to', currentUserID)
    .select();

    if (error)  return res.status(500).json({error: error.message});
    if (data.length === 0) return res.status(404).json({error: `Item ${itemID} not found`});
    res.json({message: `Item ${itemID} returned.`});
}

exports.setItemReturned = async (req, res) => {

    const {itemID} = req.body;
    const currentUserID = req.user.id;

    const { data, error } = await supabase
    .from('items')
    .update({status: enums.DB_ENUM_STATUS_AVAILABLE, lent_to: null})
    .eq('id', itemID)
    .eq('owner_id', currentUserID)
    .select();

    if (error)  return res.status(500).json({error: error.message});
    if (data.length === 0) return res.status(404).json({error: `Item ${itemID} not found`});
    res.json({message: `Item ${itemID} recovered.`});
}