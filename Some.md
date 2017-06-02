## Session
session使用MongoDB存储，

每次有更新当前session中的user对象之后，session中存储的数据也会被更新，这个是自动的。

所以在这之后，用户登录的过期时间会重新计算。这个暂时不需要更改。

## 环境变量

运行需要几个环境变量：

|序号|说明                                                    |
|:-  |:-                                                      |
1    | `env`: 运行环境， development 或者 production          |
2    | `dbuser`：远程数据库的用户名                           |
3    | `dbpwd`：远程数据库的密码                              |
4    | `debug=my-app:*`：debug模块纪录日志需要这个环境变量    |

## 一些注意事项

MongoDB的id为 *ObjectID* 类型，在模板中使用的话需要调用 `toString()` 方法转为 *String* 类型，否则 `data-test=some._id`，渲染出来是 `""val-id""` 这样，会多一个双引号。
