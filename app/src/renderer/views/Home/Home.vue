<template>
  <main>
    <div v-if="!activeProject || true">
      <button v-on:click="newProject()" class='btn btn-primary'>
        New Project
      </button>
      <button v-on:click="openProject()" class='btn btn-primary'>
        Open Project
      </button>
    </div>
    <div v-if="activeProject">
      <h1>{{ activeProject.name }}</h1>

      <div v-for="routine of activeProject.routines" v-bind:key="routine.name">
        {{ routine.name }}
        <button class='btn btn-primary'>
          Edit
        </button>
      </div>
    </div>
  </main>
</template>

<script>
  import Project from '../../models/project'

  const electron = require('electron')
  const fs = require('fs')
  const { dialog } = require('electron').remote
  // const path = require('path')
  const fileFilters = [{ name: 'Json Project Config', extensions: ['json'] }]

  export default {
    name: 'home',
    data: function () {
      return {
      }
    },
    computed: {
      activeProject: function () {
        return this.$store.state.Application.fileData
      }
    },
    created: function () {
      const userDataPath = (electron.app || electron.remote.app).getPath('userData')
      fs.readdir(userDataPath, (err, files) => {
        if (err) return
        console.log(files)
      })
      console.log(this)
    },
    methods: {
      newProject () {
        const filepath = dialog.showSaveDialog(
          {filters: fileFilters}
        )
        this.createProject(filepath)
      },
      openProject () {
        const filepath = dialog.showOpenDialog(
          {filters: fileFilters}
        )
        fs.readFile(filepath[0], 'utf8', (err, contents) => {
          if (err) return
          this.$store.dispatch('OPEN_FILE', { file: filepath[0], contents: JSON.parse(contents) })
        })
      },
      createProject (path) {
        const proj = new Project()
        fs.writeFile(path, JSON.stringify(proj), (err) => {
          if (err) throw err
          this.$store.dispatch('OPEN_FILE', { file: path, contents: proj })
        })
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  main {
    display: flex;
    justify-content: space-between;
  }

</style>
