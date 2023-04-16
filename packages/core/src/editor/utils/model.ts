import { ModelType } from '../../types/monaco';

// 由于该组件简单处理文件系统，不存在文件夹之类的路径，故：filePath就是filename
export const findModel = (models: ModelType[], filePath: string) => models.find((model) => model.filename === filePath);
