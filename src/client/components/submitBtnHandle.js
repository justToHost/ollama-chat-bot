export default class handleSubmitBtn{
  constructor(btn){
    this.submitBtn = btn
  }

  disable(){
    console.log(this.submitBtn, 'disable btn')

    this.submitBtn.disabled = true
    this.submitBtn.classList.add('disabled')
  }

  enable(){
    this.submitBtn.disabled = false
    this.submitBtn.classList.remove('disabled')
  }
}
