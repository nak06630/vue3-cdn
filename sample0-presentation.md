---
presentation:
  width: 1080
  height: 720
  theme: beige.css
  margin: 0.1
---


<!-- 左寄せにする -->
<style>
  .reveal .slides {
    text-align: left;
  }
  .reveal ul li {
    font-size:0.85em;
    margin-top:0;
  }
  .reveal ul ul li {
    font-size:0.85em;
    margin-top:0;
  }
</style>

<!-- slide id="title" -->

### Vue3 (compositionAPI)

https://v3.ja.vuejs.org/guide/introduction.html


<!-- slide id="1" -->

### Vueの種類

- ~~Vue2 (CDN)~~
- ~~Vue2~~
- Vue3 (CDN)
- ~~Vue3 (OptionAPI)~~
- Vue3 (CompositionAPI)

<!-- slide -->

### CDN版

- HTMLファイルだけでも動作する。
- typescript が使えない。
- import, exportが使えない。
    - 使えなくもないけど
- 単一ファイルコンポーネントが使えない。
    - 使えなくもないけど

<!-- slide -->

### sample1

- 1.1 Vue3(compositionAPI) の基本型

    ```js
    const RootComponent = {
        setup() {
            /* ソースコード */
        },
        template: `
            /* テンプレート */
        `
    }
    const app = Vue.createApp(RootComponent)
    const vm = app.mount('#app')
    ```

<!-- slide -->

### sample2

- CompositionAPI
    - [なぜ compositionAPIなのか](https://v3.ja.vuejs.org/guide/composition-api-introduction.html#%E3%81%AA%E3%81%9B%E3%82%99-composition-api-%E3%81%AA%E3%81%AE%E3%81%8B)
    - setup コンポーネントオプション
    - ref によるリアクティブな変数
    - ライフサイクルフックを setup の中に登録する
    - watch で変化に反応する
    - スタンドアロンな computed プロパティ
- 状態管理
    - 2.2 props/emit
        - コンポーネントの親子間の状態管理。重要だけど説明省略
    - 2.3 pinia
        - vuex後継。npm版なら必要なさそう。
    - 2.4 inject/proide
        - あんまり使わない

<!-- slide -->

### sample3
  
- 3.1 Vue3 + Vuetify3 の基本型

```js
<script>
const { createApp, ref } = Vue
const vuetify = Vuetify.createVuetify()
const app = createApp({
  template: `
    <v-app>
    </v-app>
  `
})
.use(vuetify)
.mount("#app")
```

<!-- slide -->

### sample4

- 4.1 Fetch
    - async/await
    - onMounted
- 4.2 Methodほか
    - method
    - computed
    - リストレンダリング（v-for）
- 説明ないけど重要
    - reactive
    - 条件付きレンダリング（v-if, v-else）
    - イベントハンドリング（@など）
    - watch

<!-- slide -->

### sample5

- 6.1 単一ページアプリケーションまとめ
    - 単純なので必要ないけど、いろいろ機能分割した例

<!-- slide -->

### sample6

- 7.1 Vue Router (v4)
    - アプリにパスをつけられる。
    - CDNの場合は擬似的な対応。

```js
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/users', component: Users },
      { path: '/about', component: About },
    ]
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})
```

<!-- slide -->

### sample7

- 8.1 Cognito (signIn のみ)

```js
  const poolData = {
    UserPoolId : 'ap-northeast-1_**********',
    ClientId : '****************'
  }
  const userPool = new CognitoUserPool(poolData)
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new CognitoUser(userData)
  const authenticationData = { Username: username, Password: password }
  const authenticationDetails = new AuthenticationDetails(authenticationData)
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        idToken.value = result.idToken.jwtToken
        resolve(result)
      },
      onFailure: err => {
        reject(err)
      }
    })
  })
```

<!-- slide -->

### sample8

- 複数ページアプリケーション（全部入り）

<!-- slide -->

### sample9

- その他サンプル

<!-- slide -->

### NPM版

- vue3
    - SFC（.vueファイル）：単一ファイルコンポーネント
    - `<script setup>`
        - Vue3.2から利用可能。
        - return は省略。いろいろ短く書ける。
- nuxt3
    - import も省略
    - さらにいろいろアシスト機能あり。
    - SPA/SSRなどを簡単に切り替えられる
