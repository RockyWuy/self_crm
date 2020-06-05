/*
 * @Author: rockyWu
 * @Date: 2020-06-01 14:04:29
 * @Description:
 * @LastEditors: rockyWu
 * @LastEditTime: 2020-06-01 14:08:19
 */

// Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）

// 解析步骤：接收代码并输出 AST。 这个步骤分为两个阶段：词法分析（Lexical Analysis）和 语法分析（Syntactic Analysis）
// 词法分析: 词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流
// 语法分析: 把一个令牌流转换成 AST 的形式。这个阶段会使用令牌中的信息把它们转换成一个 AST 的表述结构，这样更易于后续的操作

// 转换步骤：接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作

// 代码生成步骤：把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）
