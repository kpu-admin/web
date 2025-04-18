export enum ActionEnum {
  ADD = 'add',
  COPY = 'copy',
  DELETE = 'delete',
  EDIT = 'edit',
  VIEW = 'view',
}
export const VALIDATE_API: Record<string, any> = {
  [ActionEnum.ADD]: 'Save',
  [ActionEnum.EDIT]: 'Update',
  [ActionEnum.COPY]: 'Copy',
}
/**
 * 文件的业务 类型
 */
export enum FileBizTypeEnum {
  // 默认库 租户logo
  DEF_TENANT_LOGO = 'DEF__TENANT__LOGO',
  // 默认库 应用logo
  DEF_APPLICATION_LOGO = 'DEF__APPLICATION__LOGO',
  // 基础库 用户头像
  BASE_USER_AVATAR = 'DEF__USER__AVATAR',
  // 基础库 文件中心
  BASE_FILE = 'BASE__FILE',
  // 扩展库 消息内容附件
  EXTEND_MSG_CONTENT = 'EXTEND__MSG__CONTENT',
}
export enum FileBucketEnum {
  // 需要自行在华为云或minio等第三方对象存储提前创建 公开读写的桶
  public = 'tt-public',
}
export enum EnumEnum {
  // msg
  TaskStatus = 'TaskStatus',
  SendStatus = 'SendStatus',
  SourceType = 'SourceType',
  ProviderType = 'ProviderType',
  MsgBizType = 'MsgBizType',
  MsgType = 'MsgType',
  // file
  FileType = 'FileType',
  FileStorageType = 'FileStorageType',
  // tenant
  TenantConnectTypeEnum = 'TenantConnectTypeEnum',
  // authority
  ApplicationAppTypeEnum = 'ApplicationAppTypeEnum',
  TenantStatusEnum = 'TenantStatusEnum',
  TenantTypeEnum = 'TenantTypeEnum',
  Sex = 'Sex',
  AuthorizeType = 'AuthorizeType',
  LogType = 'LogType',
  LoginStatusEnum = 'LoginStatusEnum',
  DataScopeType = 'DataScopeType',
  HttpMethod = 'HttpMethod',

  DateType = 'DateType',
  PopupTypeEnum = 'PopupTypeEnum',
  TplEnum = 'TplEnum',
  EntitySuperClassEnum = 'EntitySuperClassEnum',
  GenTypeEnum = 'GenTypeEnum',
  SqlConditionEnum = 'SqlConditionEnum',
  SuperClassEnum = 'SuperClassEnum',
  ComponentEnum = 'ComponentEnum',
  ProjectTypeEnum = 'ProjectTypeEnum',
  TemplateEnum = 'TemplateEnum',
  FileOverrideStrategyEnum = 'FileOverrideStrategyEnum',

  // test
  ProductType = 'ProductType',
  DefGenTestSimpleType2Enum = 'DefGenTestSimpleType2Enum',
  DefGenTestTreeType2Enum = 'DefGenTestTreeType2Enum',
}
export enum DictEnum {
  // 全局
  GLOBAL_SEX = 'GLOBAL_SEX',
  AREA_LEVEL = 'GLOBAL_AREA_LEVEL',
  NATION = 'GLOBAL_NATION',
  EDUCATION = 'GLOBAL_EDUCATION',

  // base
  POSITION_STATUS = 'BASE_POSITION_STATUS',
  ORG_TYPE = 'BASE_ORG_TYPE',
  ROLE_CATEGORY = 'BASE_ROLE_CATEGORY',
  EchoDictType_Base_INTERFACE_EXEC_MODE = 'INTERFACE_EXEC_MODE',
  EchoDictType_Base_MSG_TEMPLATE_TYPE = 'MSG_TEMPLATE_TYPE',
  EchoDictType_Base_NOTICE_TARGET = 'NOTICE_TARGET',
  EchoDictType_Base_NOTICE_REMIND_MODE = 'NOTICE_REMIND_MODE',
  EchoDictType_Base_MSG_INTERFACE_LOGGING_STATUS = 'MSG_INTERFACE_LOGGING_STATUS',
  DATASOURCE_CONFIG_DRIVER = 'DATASOURCE_CONFIG_DRIVER',
  // tenant
  RESOURCE_TYPE = 'TENANT_RESOURCE_TYPE',
  RESOURCE_DATA_SCOPE = 'TENANT_RESOURCE_DATA_SCOPE',
  RESOURCE_OPEN_WITH = 'TENANT_RESOURCE_OPEN_WITH',
  RESOURCE_TRANSITION_NAME = 'TENANT_RESOURCE_TRANSITION_NAME',
  DICT_TYPE = 'TENANT_DICT_TYPE',
  DICT_CLASSIFY = 'TENANT_DICT_CLASSIFY',
  PARAMETER_TYPE = 'TENANT_PARAMETER_TYPE',
  APPLICATION_TYPE = 'TENANT_APPLICATION_TYPE',
  CLIENT_TYPE = 'TENANT_CLIENT_TYPE',
  AREA_SOURCE = 'TENANT_AREA_SOURCE',
  // DictionaryType_Global_EDUCATION = 'GLOBAL_EDUCATION',
  DictionaryType_Global_DATA_TYPE = 'DATA_TYPE',

  TENANT_LOGIN_STATUS = 'TENANT_LOGIN_STATUS',
}

export enum MsgTemplateCodeEnum {
  // 注册短信
  REGISTER_SMS = 'REGISTER_SMS',
  // 注册邮件验证码
  REGISTER_EMAIL = 'REGISTER_EMAIL',
  // 手机登录短信
  MOBILE_LOGIN = 'MOBILE_LOGIN',
  MOBILE_EDIT = 'MOBILE_EDIT',
  EMAIL_EDIT = 'EMAIL_EDIT',
}
