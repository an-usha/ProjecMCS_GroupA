const { pool } = require("../config/mysqldatabase");

const getBlockedSchmCode = async()=>{
    const sql=`SELECT schmCode FROM blocked_schm_code where isDeleted='F'`;
    try{
    const [rows,feilds]=await pool.execute(sql);
    return rows;
    }catch(error){
        console.error('Error while fetching blockedSchmCodeList');
        return false;
    }
    
};

const getBlockedSchmType= async()=>{
    const sql=`SELECT schmType FROM blocked_schm_type where isDeleted='F'`;
    try{
    const [rows,feilds]=await pool.execute(sql);
    return rows;
    }catch(error){
        console.error('Error while fetching blocked schm type list');
        return false;
    }
};

module.exports = {getBlockedSchmCode,getBlockedSchmType};