# 年会抽奖系统

------

去年年会的抽奖系统，适用44人以下公司或团队吧，今天整理了下，给有需要的人～写的比较早了，代码比较烂，见谅：）

为了省去麻烦。。bower的文件我没有添加ignore，只需要用**http-server**起个小服务器，访问**index.html**就可以了，按空格或者点击中间的就可以开始抽奖。

代码里是调用了示例JSON，有需要的可以找后台出接口：）

员工列表可以直接改JSON，或者出接口，都随意，大概格式如下

    [
        {"employee_id":1},
        {"employee_id":2}
    ]

对应的，员工的照片应该放在**public/photos**和**public/large_photos**，large_photos里图片格式为**jpg**，photos里图片格式为**png**，主要是怕png照片会太大才这么做，按工号命名，我这是靠工号id来展示照片的～

调用抽奖接口可以改**public/js/main.js**下的**lootteryUrl**变量，返回有一下几种情况：

普通：

    {
        "error":0,
        "employee_id":21 // 中奖人工号
    }

彩蛋：

    {
        "error":0,
        "employee_id":21, // 中奖人工号(比如是老板～可以多传下面的参数)
        "egg":"yes",
        "hongbao":"0888" // 这个是红包数额
    }

注意：彩蛋里的这个红包啊，是要在出了照片后再点一下空格出来的～

出错：

    {
        error:1, // 错误编码，这个随意
        msg:"错误文案"  // 其实不会出错的，以前公司规范，习惯了
    }

以下是效果图：

![还未抽奖][1]

还未抽奖状态


  ![抽奖中][2]

  抽奖中，**要再点一次才会请求抽奖结果！**


![员工中奖][3]

员工中奖


![彩蛋，老板发红包][4]

彩蛋，老板发红包


  [1]: http://johnnydan.oss-cn-beijing.aliyuncs.com/lottery/DB49576C-B7FF-4B90-93E9-159531C77812.png
  [2]: http://johnnydan.oss-cn-beijing.aliyuncs.com/lottery/BB1F0D0D-7EC2-44C3-9138-D22A08920750.png
  [3]: http://johnnydan.oss-cn-beijing.aliyuncs.com/lottery/D8B38D23-3062-49E5-935E-8C72830DBBB6.png
  [4]: http://johnnydan.oss-cn-beijing.aliyuncs.com/lottery/9C35E0A5-12B2-444B-AB70-4FA1A843B937.png
