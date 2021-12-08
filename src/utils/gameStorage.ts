const levelStorage = JSON.parse(
  localStorage.getItem("levelStorage") || "{}"
);
const goldStorage=JSON.parse(
  localStorage.getItem("goldStorage") || JSON.stringify({total:0,detail:[]})
)
type Param = {
  subject: number;
  level: number;
};
type UpdateLevelStorageParam = Param & {
  data: object;
};
type AddGoldStorageParam= Param & {
  num: number;
};
export default {
  // 关卡数据
  getLevelStorage({ subject, level }: Param) {
    return levelStorage[`subject_${subject}_level_${level}`];
  },
  updateLevelStorage({ subject, level, data }: UpdateLevelStorageParam) {
    if(levelStorage[`subject_${subject}_level_${level}`]){
      Object.assign(levelStorage[`subject_${subject}_level_${level}`],data)
    }else{
      levelStorage[`subject_${subject}_level_${level}`] = data;
    }
    localStorage.setItem("levelStorage", JSON.stringify(levelStorage));
  },
  // 金币数据
  getGoldStorage(){
    return goldStorage;
  },
  addGoldStorage({num,subject,level}:AddGoldStorageParam){
    goldStorage.total+=num;
    goldStorage.detail.push({
      subject,level,num
    })
  }
};
