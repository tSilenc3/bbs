import { Controller } from 'egg';

export default class TopicController extends Controller {

  async index() {
    const { ctx, service } = this;
    const topic_id: string = ctx.params.tid;
    if (topic_id.length !== 24) {
      ctx.status = 404;
      ctx.message = '此话题不存在或已被删除';
      return;
    }

    const result = await service.topic.getTopic(topic_id);
    if (!result) {
      ctx.status = 404;
      ctx.message = '此话题不存在或已被删除';
      return;
    }

    const { topic, author, replies } = result;
    // 增加点击量
    await service.topic.incVisitCount(topic._id);

    const topicObj = topic.toObject();
    const authorObj = author.toObject();
    ctx.body = {
      data: {
        topic: topicObj,
        author: authorObj,
        replies,
      },
    };
  }

  //  发新帖
  async create() {
    console.log('create topic');
    const { ctx, service } = this;

    // 检查参数
    const createRule = {
      title: {
        type: 'string',
        trim: true,
        max: 100,
        min: 5,
      },
      content: {
        type: 'string',
      },
    };
    ctx.validate(createRule, ctx.request.body);

    //  保存新帖
    const body = ctx.request.body;
    const topic = await service.topic.addNewTopic(
      body.title,
      body.content,
      ctx.user._id,
    );

    await service.user.incScoreAndReplyCount(topic.author_id, 5, 1);

    ctx.body = {
      msg: '发布成功',
    };
  }
}