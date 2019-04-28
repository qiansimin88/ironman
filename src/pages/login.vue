<template>
  <div class="login">
    <div class="login-block">
      <div class="login-font">欢迎使用3D造生产生产管理系统</div>
      <Form ref="formItem" :model="formItem" :rules="ruleValidate" autocomplete="off">
        <FormItem prop="account">
          <Input type="text" v-model="formItem.account"
                 placeholder="用户名"
                 size="large"
                 clearable
                 @on-enter="login"
                 style="width: 300px;">
            <Icon type="ios-person-outline" slot="prepend" size="large"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
                style="width: 300px;"
                @on-enter="login"
                type="password"
                clearable
                 v-model="formItem.password"
                 placeholder="密码" size="large">
            <Icon type="ios-lock-outline" slot="prepend" size="large"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button @click="submit('formItem')" long size="large">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>

export default {
    name: 'Login',
    data() {
        return {
            formItem: {
                account: '',
                password: ''
            },
            ruleValidate: {
                account: [{
                    required: true, message: '请填写手机或者邮箱', trigger: 'blur'
                }],
                password: [{ required: true, message: '请填写密码', trigger: 'blur' }, {
                    type: 'string', min: 6, message: '密码不能小于6个字符', trigger: 'blur'
                }]
            }
        };
    },
    mounted() {
    },
    methods: {
        submit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.login();
                } else {
                    this.$Message.error('请完善表单信息!');
                }
            });
        },
        home() {
            const { query } = this.$route;
            const { referer } = query;
            const url = referer || '/';
            this.$router.replace(url);
        },
        login() {
            let loginRes = null;
            let roles = null;
            return this.$http
                .get(`/user/doLogin?account=${this.formItem.account}&password=${this.formItem.password}`)
                .then((data) => {
                    loginRes = data;
                    this.$localStore.set('token', loginRes.token);
                    return this.getRole(data.data.userId);
                })
                .then((res) => {
                    roles = res.result || [];
                    roles = roles.sort((a, b) => a.id - b.id);
                    return this.setDefaultRoleName(roles);
                })
                .then(() => {
                    const { data, account } = loginRes;
                    this.$localStore.set('user_id', data.userId);
                    this.$localStore.set('user_account', account);
                    this.$localStore.set('user_info', data);
                    this.$localStore.set('role_id', (roles && roles[0] && roles[0].id) || '');
                    this.$localStore.set('role_name', (roles && roles[0] && roles[0].name) || '');
                    this.$localStore.set('roles', roles);
                    this.$Message.success('登录成功！');
                    setTimeout(() => {
                        this.home();
                    }, 1500);
                })
                .catch((err) => {
                    console.log(err);
                    this.$Message.error('登录出错！');
                });
        },
        getRole(userId) {
            return this.$http.post('/role/getUserRoleByConditions', {
                userRoleDto: { userId, type: 'produce' },
                pageInfo: {
                    pageIndex: 1,
                    pageSize: 9999
                }
            }).then(data => data);
        },
        setDefaultRoleName(roles) {
            const roleName = roles && roles[0] && roles[0].name;
            return this.$http
                .get('/bops/user/switchRole.json', { params: { roleName } })
                .then(data => data);
        }
    }
};
</script>
<style scoped lang="less">
  .login{
    background-image: url('../assets/login_bg.jpg');
    background-repeat: no-repeat,no-repeat;
    background-position: center center,center center;
    background-size: cover,cover;
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    .login-block{
      width: 396px;
      height: 292px;
      padding: 50px;
      padding-top: 40px;
      background-color: @primary-color;
      box-shadow:0 2px 4px 0 rgba(0,0,0,0.09);
      border-radius:6px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -146px;
      margin-left: -198px;
      .login-font{
        font-family:PingFangSC-Medium;
        color: #fff;
        font-size:20px;
        margin-bottom: 30px;
        line-height:20px;
        text-align:center;
      }
    }
  }
</style>
