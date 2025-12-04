---
tags:
  - java
---

# session

getSession(boolean) → セッションを取得

getID() → セッションIDを取得

getCreationTime() → セッション生成時刻を取得

setAttribute(String, Object) → セッションの属性を設定

getAttribute(String) → セッションの属性を取得

invalidate() → セッションを破棄

setMaxInativeInterval(int) → セッションのタイムアウト時間を設定

getMaxInactiveInterval() → セッションのタイムアウト時間を取得

# scope

### request scope

HttpServletRequest request.setAttribute();

HttpServletRequest request.getAttribute();

## session scope

HttpSession request.getSession(boolean);

void session.setAttribute();

void session.getAttribute();

## application scope

ServletContext [this.]getServletContext();

void application.setAttribute();

void application.getAttribute();

## page scope

pageContext

# 共通メソッド

Object getAttribute(String);

Enumeration getAttributeNames()

void removeAttribute(String);

void setAttribute(String, Object);

# パラメータ

String request.getParameter(String);

Enumeration request.getParameterNames();

# スコープのまとめ

||**Servlet**|**JSP**||
|---|---|---|---|
|**request**|String request.getParameter(String)|String request.getParameter(String)|**GET from <form>**|
|**request**|doPost(HttpServletRequest request)|||
|doGet(HttpServletRequest request)|none|**READY**||
|**request**|void request.setAttribute(String, Object)|void request.setAttribute(String, Object)|**SET**|
|**request**|Object request.getAttribute(String)|Object request.getAttribute(String)|**GET**|
|**session**|HttpSession request.getSession(boolean)|none|**READY**|
|**session**|void session.setAttribute(String, Object)|void session.setAttribute(String, Object)|**SET**|
|**session**|Object session.getAttribute(String)|Object session.getAttribute(String)|**GET**|
|**application**|ServletContext getServletContext|none|**READY**|
|**application**|void application.setAttribute(String, Object)|void application.setAttribute(String, Object)|**SET**|
|**application**|Object application.getAttribute(String)|Object application.getAttribute(String)|**GET**|

# Cookie

new Cookie(”String”, “String”); → Cookieオブジェクトを作成

Cookie[] request.getCookies(); → 全てのCookieを取得 …nullable

void responce.addCookie(Cookie); →　Cookieをブラウザに追加

### Cookie ck;

String ck.getName(); → キーを取得

String ck.getValue(); → 値を取得

void ck.setValue(String); → 値を設定

void ck.setMaxAge(int); → 秒数で有効期限を設定((s_m_h*d)の形で設定するとよい)

ck.setMaxAge(0)…Cookieの削除

### 日本語

Cookie ck = new Cookie(

URLEncoder.encode(”キー”, “UTF-8”),

URLEncoder.encode(”値”, “UTF-8”)

);

String key = URLDecoder.decode(ck.getName(), “UTF-8”);

String value = URLDecoder.decode(ck.getValue(), “UTF-8”);

# EL式

${sessionScope[’name’]} |

${[sessionScope.name](http://sessionScope.name)} |

${name}(曖昧)

### 暗黙オブジェクト

requestScope

sessionScope

applicationScope

pageScope

param

cookie

### 暗黙

array[i]

arrayList[i]

hashMap[i] | hashMap.i

# 標準タグアクション

? JSP内で`<% %>`の代わりに使用できるタグ形式の機能

## 基本記法 - JavaBeans

`<jsp:useBean id=”ca” class=”Beans.Calc” scope=”request” />`

id : JavaBeansの参照変数名

class : クラス名 `パッケージ.クラス`

`<jsp:getProperty name=”ca” property=”num1” />`

`<jsp:setProperty name=”ca” property=”num1” value=”50” />`

name : useBeanタグのidに記述した名称

property : beanのgetterにアクセス

## forward

`<jsp:forward page=”test.jsp” />`

## include

`<jsp:include page=”test.jsp” />`

## param

```html
<jsp:forward page="test.jsp">
	<jsp:param name=”title” value=”aaa” />
</jsp:forward>
```