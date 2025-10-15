const cron = require("node-cron");
const { pool } = require("./mysqldatabase");
const callAPI = require("./apims");
const dayjs = require('dayjs');
const { formattedDateTime } = require('../config/currentDate');
const tranId = formattedDateTime(new Date());

const MissedCallList=require("../model/missedCallList");

const {saveDataFromCallCenterDB,
    saveloadDataDate,
    getLastLoadData}= require("../controller/missedCallListController");

const cronSchedule = process.env.LOAD_DATA_FROM_CALL_CENTER_DB_SCHEDULE;
const functionName= process.env.CALL_CENTER_API_MISSED_CALL_LIST_TIMESTAMP;

const loadDataFromDB = async () => {
    try{
    let loadDateTime=await getLastLoadData();
        loadDateTime=dayjs(loadDateTime).format("YYYY-MM-DD HH:mm:ss");
    console.log(`Fetching Data from DB: ${dayjs(loadDateTime).format("YYYY-MM-DD HH:mm:ss")}`);

    

    /* const requestModel = {
        StartDate: loadDateTime,
      }; */

      const requestModel = {
        StartDate: loadDateTime,
        "TransactionId": tranId
      };

    const result= await callAPI(functionName,requestModel);
    if(result.Code==="0" && result.Data !==null){
                    for(i=0; i<(result.Data.ListResponse).length;i++){
                        let missedCallList=new MissedCallList();
                        missedCallList.calldate=dayjs(result.Data.ListResponse[i].calldate,{format:'MM/DD/YYYY HH:mm:ss'}).format("YYYY-MM-DD HH:mm:ss");
                        missedCallList.source=result.Data.ListResponse[i].src;
                        missedCallList.destination=result.Data.ListResponse[i].dst;
                        missedCallList.channel=result.Data.ListResponse[i].channel;
                        missedCallList.destChannel=result.Data.ListResponse[i].dstchannel;
                        missedCallList.duration=result.Data.ListResponse[i].duration;
                        missedCallList.billtime=result.Data.ListResponse[i].billsec;
                        //console.log(result.Data.ListResponse[i]);
                        await saveDataFromCallCenterDB(missedCallList);
                    }
                    let lastDataSaveDate=result.Data.ListResponse[result.Data.ListResponse.length-1].calldate;
                    lastDataSaveDate=dayjs(lastDataSaveDate,{format: 'MM/DD/YYYY HH:mm:ss'}).format('YYYY-MM-DD HH:mm:ss');
                    console.log(lastDataSaveDate);
                    await saveloadDataDate(lastDataSaveDate);
                    
            }else{
                console.log("No Data Found: "+loadDateTime);
            }
    
    }catch(error){
        console.error(error);
    }
};

cron.schedule(cronSchedule, loadDataFromDB);