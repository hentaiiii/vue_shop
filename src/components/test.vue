<!-- test -->
<template >
  <div>
    <template slot-scope="user">
      {{user[0]}}
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: ['zs', 'ls', 'we']
    };
  }
}

</script>
<style lang='less' scoped>
</style>