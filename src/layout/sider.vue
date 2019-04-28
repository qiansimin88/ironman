<template>
  <div id="app" class="home">
    <Layout>
      <Header
        style="padding: 0; box-shadow:0 1px 2px 0 rgba(52,59,102,0.20);min-width: 1280px;z-index: 1">
        <div class="nav">
          <div class="img-wrap"><img height="19" width="195" src="../assets/tu.png"  /></div>
          <div class="content-wrap">
            <section class="content-wrap-left">
            </section>
            <Dropdown style="margin:0 10px" @on-click="roleChange" trigger="click" v-if="curRole">
              <Button type="primary">
                {{curRole && roleMap[curRole]}}
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem :name="k.id" v-for="k in roles" :key="k.id">
                  {{k.nameCn}}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown @on-click="actionChange" placement="bottom-end">
              <div class="info-wrap">
                <Avatar :src="avatar" size="small" />
                <span class="title singer-ell">{{userName}}</span>
                <Icon type="ios-arrow-down"></Icon>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem name="loginOut" >退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="actSide" theme="light" width="auto" @on-select="onMenuChange">
            <MenuItem v-for='item in sides'
                      :key="item.icon"
                      :name="item.value"
                      :to="{path: item.path}"
                      style="opacity:0.8;">
              <template  v-if="item.unReadCount > 0">
                <Badge :count="item.unReadCount" :overflow-count="100">
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="`#${item.icon}${actSide === item.value ? '-white':''}`"></use>
                  </svg>
                  {{item.title}}
                </Badge>
              </template>
              <template>
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="`#${item.icon}${actSide === item.value ? '-white':''}`"></use>
                </svg>
                {{item.title}}
              </template>
            </MenuItem>
          </Menu>
        </Sider>
        <Layout style="padding: 24px; background: #fff;min-width: 1080px">
          <Content style="min-height: 100vh;">
            <router-view></router-view>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import {
    Layout, Content, Header, Sider, Menu, MenuItem, Badge, Dropdown, Avatar
} from 'iview';
import SideContant from './sider';

export default {
    name: 'Home',
    components: {
        Layout, Content, Header, Sider, Menu, MenuItem, Badge, Dropdown, Avatar
    },
    data() {
        return {
            sides: [],
            actSide: '',
            curRole: '',
            userName: '',
            avatar: '',
            roles: [],
            roleMap: {},
            msgs: [],
            unReadCount: 0
        };
    },
    computed: {},
    mounted() {
        this.genSide();
        this.init();
    },
    methods: {
        genSide() {
            const roleName = this.$localStore.get('role_name');
            const sideKey = this.$localStore.get('side-key');
            const arr = SideContant.filter(v => !v.role || v.role.indexOf(roleName) !== -1);
            this.sides = arr;
            this.$nextTick(() => {
                const { name } = this.$route;
                const isMenu = arr.findIndex(v => v.value === name);
                this.actSide = isMenu !== -1 ? name : sideKey || 'Technical';
            });
        },
        init() {
            this.avatar = this.$Oss({
                id: this.$localStore.get('user_info').avatar, w: 45, h: 45, e: 1, c: 1
            });
            this.userName = this.$localStore.get('user_info').nickName;
            this.curRole = this.$localStore.get('role_id');
            const roles = this.$localStore.get('roles') || [];
            this.roles = roles;
            if (!roles) return false;
            this.roleMap = roles.reduce((pre, cur) => {
                const v = pre;
                if (!cur) return v;
                v[cur.id] = cur.nameCn;
                return v;
            }, {});
        },
        roleChange(name) {
            if (name === this.curRole) return;
            const roleId = Number(name);
            const curRole = this.roles.find(item => item.id === roleId);
            this.$http
                .get('/bops/user/switchRole.json', { params: { roleName: curRole.name } })
                .then((data) => {
                    this.$localStore.set('role_id', roleId);
                    this.$localStore.set('role_name', curRole.name);
                    window.location.reload();
                });
        },
        actionChange(name) {
            if (name === 'loginOut') {
                this.clear();
            }
        },
        clear() {
            this.$localStore.remove('role_id');
            this.$localStore.remove('user_id');
            this.$localStore.remove('user_info');
            this.$localStore.remove('roles');
            this.$localStore.remove('token');
            this.$localStore.remove('user_account');
            this.$localStore.remove('navKey');
            window.location.replace('/login');
        },
        onMenuChange(val) {
            this.actSide = val;
            this.$localStore.set('side-key', val);
        }
    }
};
</script>
<style lang="less" scoped>
  .home{
    .icon{
      width: 1.3em; height: 1.3em;
      display: inline-block;
      margin-right: 4px;
      fill: currentColor;
      overflow: hidden;
    }
    .nav{
      display: flex;flex-direction: row;align-items: center; background: @baseColor;
      height: 100%;
      .img-wrap{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width:270px;
        height: 100%;
      }
      .content-wrap{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        &-left{
          flex: 1;height: 30px;display: flex;flex-direction: row;align-items: center;
          .tip{
            font-size: 14px;color: #3c3d5b;width: 90px;
          }
          .marquee-wrap{
            list-style: none;
            display: flex;flex-direction: row;flex-wrap: wrap;
            li{
              height: 30px;line-height: 30px;flex: 33%;
            }
          }
        }
        .msg-wrap{
          width: 64px;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background:#f6f7fe;
          cursor: pointer;
          .icon-msg{
            width: 24px; height: 24px;
            display: inline-block;
            fill: currentColor;
            overflow: hidden;
            margin-left: 2px;
            margin-top: 22px;
          }
        }
        .info-wrap {
          display: flex;flex-direction: row;align-items: center;padding-right: 25px;
          .title{
            display: inline-block;max-width: 160px;margin: 0 4px;color: #fff;font-size: 14px;
          }
        }
      }
    }
    .contain{

    }
    .ivu-badge-count{
      border: none!important;
      box-shadow: none!important;
    }
  }
</style>
