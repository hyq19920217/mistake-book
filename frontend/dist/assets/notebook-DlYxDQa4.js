import{p as i,q as s}from"./index-BMI1Flys.js";const b=i("notebook",{state:()=>({notebooks:[],currentNotebook:null,loading:!1}),actions:{async fetchNotebooks(){this.loading=!0;try{const o=await s.get("/notebooks");this.notebooks=o.data}catch(o){throw o}finally{this.loading=!1}},async createNotebook(o){const t=await s.post("/notebooks",o);return this.notebooks.unshift(t.data),t.data},async updateNotebook(o,t){const e=await s.patch(`/notebooks/${o}`,t),n=this.notebooks.findIndex(a=>a._id===o);return n!==-1&&(this.notebooks[n]=e.data),e.data},async deleteNotebook(o){await s.delete(`/notebooks/${o}`);const t=this.notebooks.findIndex(e=>e._id===o);t!==-1&&this.notebooks.splice(t,1)},setCurrentNotebook(o){this.currentNotebook=o}}});export{b as u};
