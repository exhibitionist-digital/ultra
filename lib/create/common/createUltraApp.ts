import { Config } from './config.ts'
import outdent from 'https://deno.land/x/outdent@v0.8.0/mod.ts'
import { brightBlue, underline, yellow } from 'https://deno.land/std@0.153.0/fmt/colors.ts'
import { createFile, fetchFile, fileExtension } from './io.ts'
import {
	appContent,
	buildContent,
	clientContent,
	denoConfigContent,
	importMapContent,
	serverContent,
	styleContent,
} from './content/index.ts'
import { twindContent } from '../modules/twind/content/twind.ts'
import { stitchesConfigContent } from '../modules/stitches/content/stitchesConfig.ts'
import { queryClientContent } from '../modules/react-query/content/queryClient.ts'
import { trpcClientContent } from '../modules/trpc/content/client.ts'
import { trpcRouterContent } from '../modules/trpc/content/router.ts'

export async function createUltraApp(config: Config) {
	// Initialize file creation and naming functions
	const create = createFile(config)
	const ext = fileExtension(config)
	const dl = fetchFile(config)

	// Write standard files
	await create('deno.json', denoConfigContent(config))
	await create('importMap.json', importMapContent(config))
	await create(ext('build', false), buildContent())
	await create(ext('client', true), clientContent(config))
	await create(ext('server', true), serverContent(config))
	await create(ext('/src/app', true), appContent())
	await create('public/style.css', styleContent())
	await dl(
		'/public/favicon.ico',
		'https://github.com/exhibitionist-digital/ultra/blob/main/examples/basic/public/favicon.ico'
	)
	await dl(
		'/public/robots.txt',
		'https://github.com/exhibitionist-digital/ultra/blob/main/examples/basic/public/robots.txt'
	)

	// Write conditional files

	if (config.includes.includes('twind')) {
		await create(ext('twind', false), twindContent())
	}
	if (config.includes.includes('stitches')) {
		await create(ext('stitches.config', false), stitchesConfigContent(config))
	}
	if (config.includes.includes('react-query' || 'trpc')) {
		await create(ext('queryClient', false), queryClientContent())
	}
	if(config.includes.includes('trpc')) {
		await create('/src/trpc/router.ts', trpcRouterContent())
		await create('/src/trpc/client.ts', trpcClientContent())
	}

	// Format files
	await Deno.run({ cmd: ['deno', 'fmt', `${config.name}/`] }).status()

	// Finish up
	console.log(outdent`
      \n 🎉 Congrats! Your new Ultra project is ready, you can now cd into "${brightBlue(
			config.name
		)}" and run ${underline(yellow('deno task dev'))} to get started!
  `)

	// Exit
	Deno.exit(0)
}
