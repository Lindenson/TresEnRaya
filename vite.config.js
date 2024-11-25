module.exports = {
	root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            external: ['js/test/*'],
        },
    }
}
