const dayjs=require("dayjs");
const MissedCallList=require("../model/missedCallList");
const LoadDataDate=require("../model/loadDataDate");

const { pool } = require("../config/mysqldatabase");
const { formattedDateTime,getFormattedDate } = require("../config/currentDate");

const getMissedCallListAll = async (req,res) =>{
    console.log("Fetching missed call list All from local DB");
    let sql=`select * from missed_call_list where isDeleted='N' order by id desc`;
    try{
        const [rows,fields]= await pool.execute(sql);
         if(rows.length>0){
            res.status(200).json({status:true, 'message':'success',data:rows});
         }else{
          console.log('Record does not exist');
            res.status(200).json({status:true,'message':'success',data:[]});
         }
      }catch(error){
          console.error("Error while fetching remarks not entered list");
          res.status(200).json({status:false,'message':'failed','error':error});
      };

};

const getMissedCallListByDate = async (req,res) => {
    console.log("Fetching missed call list by date from local DB");
    console.log(req.query.dateFrom);
    console.log(req.query.dateTo);
    let sql=`select * from missed_call_list where isDeleted='N' and cast(calldate as date) between ? and ? order by id desc`;
    try{
        const [rows,fields]= await pool.execute(sql,[req.query.dateFrom, req.query.dateTo]);
         if(rows.length>0){
            for(i=0;i<rows.length;i++){
                rows[i].calldate=dayjs(rows[i].calldate).format("YYYY-MM-DD HH:mm:ss");
                if(rows[i].remarksProvidedOn !== null){
                rows[i].remarksProvidedOn=dayjs(rows[i].remarksProvidedOn).format("YYYY-MM-DD HH:mm:ss");
                }
            }
            res.status(200).json({status:true, 'message':'success',data:rows});
         }else{
          console.log('Record does not exist');
            res.status(200).json({status:true,'message':'success',data:[]});
         }
      }catch(error){
          console.error("Error while fetching missed call list datewise "+error);
          res.status(200).json({status:false,'message':'failed','error':error});
      };

};

const deleteMissedCallRecord = async (req, res) =>{
    console.log("Deleting missed call list record");
    console.log(req.query.id);
    let sql=`update missed_call_list 
                        set isDeleted='Y',
                            deletedBy=?,
                            deletedByName=?,
                            deletedOn=? 
                        where id=? and isDeleted='N'`;
        try{
            const [rows,fields]= await pool.execute(sql,[
                                            req.body.token_data.domainUserName,
                                            req.body.token_data.employeeName,
                                            dayjs(formattedDateTime(new Date()).format("YYYY-MM-DD HH:mm:ss")),
                                            req.query.id]);
                if(rows.affectedRows===1){
                    res.status(200).json({status:true, 'message':'success',data:req.query.id});
                }else{
                    res.status(200).json({'status':false,'message':'failed','error':'Record does not exist'});
                }
            }catch(error){
                console.error(`Error while deleting missed call list `+error);
                res.status(200).json({status:false,'message':'failed','error':error});
            };
};

const provideRemarksMissedCall = async (req, res) =>{
    console.log("updating missed call remarks");
    let sql=`update missed_call_list 
                            set 
                                remarks=?,
                                remarksProvidedBy=?,
                                remarksProvidedByName=?,
                                remarksProvidedOn=?
                            where id=? and isDeleted='N' and remarksProvidedBy is null`;
    let sql1=`select * from missed_call_list where isDeleted='N' and id=${req.query.id}`

        try{
            const [rows,fields]= await pool.execute(sql,[
                                            req.query.remarks,
                                            req.body.token_data.domainUserName,
                                            req.body.token_data.employeeName,
                                            formattedDateTime(new Date()),
                                            req.query.id]);
                // console.log(req.query.remarks);
                // console.log(req.body.token_data.domainUserName);        
                // console.log(req.body.token_data.employeeName);        
                // console.log(req.query.id);        
                if(rows.affectedRows===1){
                    let [rows1,fields1]= await pool.execute(sql1);
                    res.status(200).json({'status':true, 'message':'success', data:rows1});
                }else{
                    res.status(200).json({'status':false,'message':'failed','error':'Failed to update remarks'});
                }
            }catch(error){
                console.error(`Error while updating missed call remarks `+error);
                res.status(200).json({status:false,'message':'failed','error':error});
            };
};


async function saveDataFromCallCenterDB (data){
    let missedCallList= new MissedCallList();
    missedCallList=data;
    //console.log(missedCallList);
    let sql=`insert into missed_call_list 
                    (calldate,source,destination,channel,destChannel,duration,billtime) values 
                    (?,?,?,?,?,?,?)`;
        try{
            await pool.execute(sql,[
                            missedCallList.calldate?missedCallList.calldate:'',
                            missedCallList.source?missedCallList.source:'',
                            missedCallList.destination?missedCallList.destination:'',
                            missedCallList.channel?missedCallList.channel:'',
                            missedCallList.destChannel?missedCallList.destChannel:'',
                            missedCallList.duration?missedCallList.duration:'',
                            missedCallList.billtime?missedCallList.billtime:'']);
            return true;
        }catch(error){
            console.error(`Error while saving missed call list from call center database `+error);
            return false;
        }
}

async function saveloadDataDate(date){
    let sql=`insert into load_data_date (calldate) values ('${date}')`;
    try{
        await pool.execute(sql);
        return true;
    }catch(error){
        console.error(`Error while saving load data date `+error);
        return false;
    }
}

async function getLastLoadData(){
    let sql=`select calldate from load_data_date where isDeleted='N' order by id desc limit 1`;
    try{
        const [rows,fields]= await pool.execute(sql);
        if(rows.length===1){
            return rows[0].calldate;
        }else if(rows.length===0){
            return getFormattedDate(new Date());
        }else{
            return false;
        }
    }catch(error){
        console.error('Error while getting latest calldate from load_data_date');
        return false;
    }
}

module.exports = {
    getMissedCallListAll,
    getMissedCallListByDate,
    deleteMissedCallRecord,
    provideRemarksMissedCall,
    saveDataFromCallCenterDB,
    saveloadDataDate,
    getLastLoadData
}

