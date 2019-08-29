var Constants = require('./Constants')

class ReturnMsgUtils{


    constructor() {

    }

    /**
     * 自定义返回信息
     * @param res
     * @param code
     * @param message
     * @param data
     */
    static returnMsg(res,code,message,data){
        res.json({
            message: message,
            ret: code,
            data: data
        })
    };

    /**
     * 返回带数据的成功
     * @param res
     * @param data
     */
    static returnSuccessData(res ,data){
        res.json({
            message: Constants.message.success,
            ret: Constants.code.success,
            data: data
        })
    };

    /**
     * 返回成功
     * @param res
     */
    static returnSuccessMsg(res){
        res.json({
            message: Constants.message.success,
            ret: Constants.code.success
        })
    };

    /**
     * 返回失败
     * @param res
     */
    static returnErrorMsg(res){
        res.json({
            message: Constants.message.error,
            ret: Constants.code.error
        })
    };
}

module.exports = ReturnMsgUtils
