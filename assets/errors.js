class ErrorMessage {
    constructor(status,msg){
        this.status = status
        this.msg = msg
    }
}

const errors = {
    makecomment: new ErrorMessage(400, '댓글 작성 실패' ),
    theotherone: new ErrorMessage(401, '댓글 작성자만 가능한 동작입니다.')






}

module.exports = errors