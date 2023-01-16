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


<!-- slide -->

### sample6

- 6.1 単一ページアプリケーションまとめ
    - 単純なので必要ないけど、いろいろ機能分割した例

<!-- slide -->

### sample7

- 7.1 Vue Router (v4)
    - アプリにパスをつけられる。
    - CDNの場合は擬似的な対応。

<!-- slide -->

### sample8

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

### sample9

- 複数ページアプリケーション（全部入り）

<!-- slide -->

### sample10

- Etc

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

<!-- slide -->

<!-- https://qiita.com/KoheiKawabata/items/444369fd082cc90b1ac7 -->

        <p><span style="font-size:24px">Cognitoを使用したOAuth2 Login設定クラスのポイント</span></p>
        <div style="display:flex;display:-webkit-flex;display:-moz-flex;">
        <pre style="font-size:8px; margin: 0;line-height:1.5em; width:800px">
          <code data-trim class="hljs java" data-noescape>

            @EnableWebSecurity //(1)
            public class OAuth2LoginSecurityConfig extends WebSecurityConfigurerAdapter {

                @Autowired
                ClientRegistrationRepository clientRegistrationRepository; //(2)

                @Override
                protected void configure(HttpSecurity http) throws Exception {
                    http.authorizeRequests(
                            authorize -> authorize
                                    .antMatchers("/favicon.ico").permitAll()
                                    .antMatchers("/webjars/*").permitAll()
                                    .antMatchers("/static/*").permitAll()
                                    .anyRequest().authenticated())
                            .oauth2Login(oauth2 -> oauth2         //(3)
                                    .userInfoEndpoint(userInfo -> userInfo
                                            .userAuthoritiesMapper(authoritiesMapper())
                                            .oidcUserService(oidcUserService())))
                            .logout(logout -> logout              //(3-ii)
                                    .logoutUrl("/logout")
                                    .logoutSuccessHandler(oidcLogoutSuccessHandler()));//(3-ii-a)
                }

                private LogoutSuccessHandler oidcLogoutSuccessHandler(){//(3-ii-b)
                    CognitoLogoutSuccessHandler cognitoLogoutSuccessHandler =
                            new CognitoLogoutSuccessHandler(clientRegistrationRepository);

                    cognitoLogoutSuccessHandler.setPostLogoutRedirectUri("{baseUrl}");

                    return cognitoLogoutSuccessHandler;

                }

                private OidcUserService oidcUserService(){//(3-i-a)
                    OidcUserService oidcUserService = new OidcUserService();
                    oidcUserService.setOauth2UserService(oAuth2UserService());
                    return oidcUserService;
                }

                private OAuth2UserService oAuth2UserService(){//(3-i-b)
                    Map<String, Class<? extends OAuth2User>> customUserTypes = new HashMap<>();
                    customUserTypes.put("cognito", CognitoOAuth2User.class);
                    return new CustomUserTypesOAuth2UserService(customUserTypes);
                }

                private GrantedAuthoritiesMapper authoritiesMapper(){//(3-i-c)
                    return authorities -> {
                        List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
                        for (GrantedAuthority grantedAuthority : authorities){
                            grantedAuthorities.add(grantedAuthority);
                            if(OidcUserAuthority.class.isInstance(grantedAuthority)){
                                Map<String, Object> attributes = ((OidcUserAuthority)grantedAuthority).getAttributes();
                                JSONArray groups = (JSONArray) attributes.get("cognito:groups");
                                String isAdmin = (String) attributes.get("custom:isAdmin");
                                if(Objects.nonNull(groups) && groups.contains("admin")){
                                    grantedAuthorities.add( new SimpleGrantedAuthority("ROLE_ADMIN"));
                                }else if (Objects.nonNull(isAdmin) && Objects.equals(isAdmin, "1")){
                                    grantedAuthorities.add( new SimpleGrantedAuthority("ROLE_ADMIN"));
                                }
                            }
                        }
                        return grantedAuthorities;
                    };
                }
            }
          </code>
        </pre>
        <div style="width:auto;-webkit-flex : 1 0 400px;-moz-flex : 1 0 400px;flex : 1 0 400px;">
          <ol>
            <div style="font-size:16px; margin:auto">
              <li style="margin: 15px 0px 15px">Spring Security設定クラスとして@EnableWebSecurityを付与</li>
              <li style="margin: 15px 0px 15px">OAuth2 Clientを登録したRepository。詳細は次スライド。</li>
              <li style="margin: 15px 0px 15px">configureメソッドでoauth2Loginを設定</li>
              <ul style="margin-left:20px;list-style-type: lower-roman">
                <li style="margin: 15px 0px 15px">ユーザプールのカスタムデータを設定
                  <ol style="margin-left:20px;list-style-type: lower-latin">
                    <li style="margin: 15px 0px 15px">カスタムユーザタイプを設定したOAuth2UserServiceをOidcUserServiceに設定する</li>
                    <li style="margin: 15px 0px 15px">カスタムユーザタイプをOAuth2UserServiceに設定する</li>
                    <li style="margin: 15px 0px 15px">Cognitoのカスタムパラメータに応じてロールを割り当てる</li>
                  </ol>
                </li>
                <li style="margin: 15px 0px 15px">ログアウトエンドポイントのカスタマイズ</li>
                  <ol style="margin-left:20px;list-style-type: lower-latin">
                    <li style="margin: 15px 0px 15px">カスタムLogoutSuccessHandlerを設定する</li>
                    <li style="margin: 15px 0px 15px"><a href="https://docs.spring.io/spring-security/site/docs/current/reference/html5/#oauth2login-advanced-oidc-logout" target="_blank">LogoutSuccessHanlderのpostLogoutRedirectUriを設定する</a></li>
                  </ol>
              </ul>
            </div>
          </ol>
        </div>
        </div>