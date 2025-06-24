import { observable, runInAction } from "mobx";
import service from "../service";
const EnglishStore = observable({
  //   weathers: [],
  //   city: '',
  phrases: [], // 短语数据，phrases[0].p_content取得短语；phrases[0].p_cn获得释义
  relWords: [], // 关系词，relWords[0].Hwds[0].hwd取得关系词；relWords[0].Hwds[0].tran取得关系词的释义；relWords[0].Pos取得关系词的词性
  sentences: [], // 例句，sentences[0].s_content取得例句；sentences[0].s_cn取得例句释义
  synonyms: [], // 同义词，synonyms[0].Hwds[0].word取得同义词；synonyms[0].pos取得词性；synonyms[0].tran取得词义；
  translations: [], // 翻译，translations[0].pos取得词性；translations[0].tran_cn取得词义
  ukphone: '', // 英式英标
  ukspeech: '', // 英式发音音频
  usphone: '', // 美式发音
  usspeech: '', // 美式发音音频
  word: '', // 单词
  async getEverydayEnglish() {
    try {
      const result = await service.getEverydayEnglish();
      // console.log(result);
      //   console.log(result.data);
      if (result.data.code === 200) {
        runInAction(() => {
          // 在 runInAction 中修改状态
          this.phrases = result.data.data.phrases;
          this.relWords = result.data.data.relWords;
          this.sentences = result.data.data.sentences;
          this.synonyms = result.data.data.synonyms;
          this.translations = result.data.data.translations;
          this.ukphone = result.data.data.ukphone;
          this.ukspeech = result.data.data.ukspeech;
          this.usphone = result.data.data.usphone;
          this.usspeech = result.data.data.usspeech;
          this.word = result.data.data.word;
        });
        return true;
      }
      return result.data.msg; // 没能获取数据，则返回检查
    } catch (err) {
      return err;
    }
  }
})


export default EnglishStore;