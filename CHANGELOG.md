# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.0](https://github.com/carrot-foundation/schemas/compare/v0.3.2...v0.4.0) (2026-04-07)

### Features

- **shared:** make Location coordinates optional ([f75819d](https://github.com/carrot-foundation/schemas/commit/f75819dd7a0e938b03742ba5891aa0a894019b8e))

## [0.3.2](https://github.com/carrot-foundation/schemas/compare/v0.3.1...v0.3.2) (2026-03-31)

### Bug Fixes

- address CodeRabbit annotations from PR [#112](https://github.com/carrot-foundation/schemas/issues/112) ([c58863e](https://github.com/carrot-foundation/schemas/commit/c58863e22d1cf1ab55dad948ad3a3616f393768a))

## [0.3.1](https://github.com/carrot-foundation/schemas/compare/v0.3.0...v0.3.1) (2026-03-30)

### Bug Fixes

- address code review findings in migrated scripts ([2c23576](https://github.com/carrot-foundation/schemas/commit/2c23576fb3c61ae4d03e4882324aa43694d6693b))
- improve error handling and add return types to exported functions ([e40f0c1](https://github.com/carrot-foundation/schemas/commit/e40f0c12e02b70263185a27a896a3c2e2aa0332d))
- resolve type-check errors in migrated scripts ([fa961ef](https://github.com/carrot-foundation/schemas/commit/fa961ef41a2ca1b02180fb54f3c452777d5b5d35))

### Code Refactoring

- improve type safety and reduce duplication in scripts ([f61441d](https://github.com/carrot-foundation/schemas/commit/f61441d6188292b1586020193dc058880628aa98))
- migrate AI instruction scripts to TypeScript ([1758755](https://github.com/carrot-foundation/schemas/commit/17587558c0f2124ce279d487c9c86fce09d616bd))
- migrate example-content emitters to TypeScript ([a33d5cb](https://github.com/carrot-foundation/schemas/commit/a33d5cb5899752e4e7143e06d3f9de7072aea69e))
- migrate schema pipeline scripts to TypeScript ([13586ec](https://github.com/carrot-foundation/schemas/commit/13586eca764e466cd104e648ef6fd52f860f9188))
- migrate shared utilities to TypeScript ([686dc1e](https://github.com/carrot-foundation/schemas/commit/686dc1ec4849b221d9bcd908fd6eb25ca373cd27))

## [0.3.0](https://github.com/carrot-foundation/schemas/compare/v0.2.4...v0.3.0) (2026-03-30)

### Features

- add shared reference story for schema examples ([ece4f33](https://github.com/carrot-foundation/schemas/commit/ece4f333d4f21b87074c5a4ace38b7867c61bef0))
- generate catalog schema examples from reference story ([31b4c2c](https://github.com/carrot-foundation/schemas/commit/31b4c2c7c485c28c39d58644ce2fa3218c9a7ba7))
- generate linked asset examples from reference story ([51a0fee](https://github.com/carrot-foundation/schemas/commit/51a0feed8ede6a1a1537e3585b757a5d32d8e577))
- generate receipt examples from reference story ([35cc590](https://github.com/carrot-foundation/schemas/commit/35cc590cf29b7a345e23c31288f00389ff508be5))

### Bug Fixes

- address PR review findings ([42a9872](https://github.com/carrot-foundation/schemas/commit/42a98720c7977bfd87aa93e85f4ff3c3683000b1))
- address PR review findings for error handling, JSDoc, and descriptions ([515207b](https://github.com/carrot-foundation/schemas/commit/515207b606c86b7e5db50a1d9df61cd3046edfe3))
- address PR review findings for schema metadata and examples ([c3b91e0](https://github.com/carrot-foundation/schemas/commit/c3b91e035badaac8057ce8790aa7afb60b7d2ab3))
- correct misleading JSDoc on buildExampleId helper ([8266ae1](https://github.com/carrot-foundation/schemas/commit/8266ae1a9229a5c05fd0f98949846e45b7704503))
- **shared:** align terminology with carrot-docs glossary ([6b47efb](https://github.com/carrot-foundation/schemas/commit/6b47efbcd04ba60cb26ea80827d5c01046d30985))
- **shared:** align terminology with glossary and fix schema generation newlines ([6ae9647](https://github.com/carrot-foundation/schemas/commit/6ae96473ab0e8a9b195ae212ed6f3ae08f3e607c))
- update receipt schema tests to match reference story token IDs ([a3fc039](https://github.com/carrot-foundation/schemas/commit/a3fc0397dddcda6f3a3c86c1b458abe5a3e5aefc))

### Code Refactoring

- consolidate import/export pattern in example-content index ([b1675b3](https://github.com/carrot-foundation/schemas/commit/b1675b326cab14c2cd4b643bda08252c6c345d27))
- consolidate imports and remove redundant alias in emitter tests ([170acbc](https://github.com/carrot-foundation/schemas/commit/170acbc3f3e5fea3247ce38624b6ecf7a6429215))
- normalize ID abbreviation casing across codebase ([8825ef6](https://github.com/carrot-foundation/schemas/commit/8825ef63e22fb9f2d2817ef74ae1495840ccb2d6))

## [0.2.4](https://github.com/carrot-foundation/schemas/compare/v0.2.3...v0.2.4) (2026-03-26)

### Code Refactoring

- improve code quality from technical review ([fd09f01](https://github.com/carrot-foundation/schemas/commit/fd09f0152345e8d972eab0702533c5191c9fd65e))
- **shared:** simplify getSchemaMetadata by removing dead code ([46a2b36](https://github.com/carrot-foundation/schemas/commit/46a2b36ba26c27f875efa330f3c96a718eb8112f))

## [0.2.3](https://github.com/carrot-foundation/schemas/compare/v0.2.2...v0.2.3) (2026-03-26)

### Bug Fixes

- **release:** use exec plugin for npm publish to preserve OIDC auth ([23e1fa1](https://github.com/carrot-foundation/schemas/commit/23e1fa12f3e4bda4ba47ebae23172d01bdf271c6))

## [0.2.2](https://github.com/carrot-foundation/schemas/compare/v0.2.1...v0.2.2) (2026-03-26)

### Bug Fixes

- **release:** restore NPM_TOKEN for npm auth, keep OIDC for provenance ([e587147](https://github.com/carrot-foundation/schemas/commit/e587147225836e9cac20d715d5fae495fa34cbfd))

## [0.2.1](https://github.com/carrot-foundation/schemas/compare/v0.2.0...v0.2.1) (2026-03-26)

### Bug Fixes

- **release:** use exec plugin for npm publish to preserve OIDC auth ([e3207f4](https://github.com/carrot-foundation/schemas/commit/e3207f4dcad8ac2291c758338f227d485ca144ba))

## [0.2.0](https://github.com/carrot-foundation/schemas/compare/v0.1.32...v0.2.0) (2026-03-26)

### Features

- add canonical AI instructions architecture with platform adapters ([501d377](https://github.com/carrot-foundation/schemas/commit/501d377e4f0e13a823863a33a90148cb8d1d385a))
- add ipfs_uri field to schemas and examples for better schema referencing ([889b1fc](https://github.com/carrot-foundation/schemas/commit/889b1fc7a29b8f526cd321efa2244fb28ed1497e))
- create canonical hash functions and use it in the scripts ([dba79d6](https://github.com/carrot-foundation/schemas/commit/dba79d6a5840e9bcf59d9c8e4363f8e8f4c1f273))
- enhance schema handling and utility functions ([1e7be9e](https://github.com/carrot-foundation/schemas/commit/1e7be9ee934fd8ff884313bee890e4cfac8fc3ca))
- remove participant name and create shared schemas ([0296e43](https://github.com/carrot-foundation/schemas/commit/0296e437e4c267885f12e5b81b58cfcc823b4369))
- **schema:** add 'issued_at' attribute to GasID and RecycledID schemas and update related examples ([bb70f59](https://github.com/carrot-foundation/schemas/commit/bb70f590d87c69368d718a8082c0d9244deafab8))
- **schema:** add Brazil validation to location schemas ([30d8cf4](https://github.com/carrot-foundation/schemas/commit/30d8cf48f288e2b9839c50b6deae2f150d73e6d1))
- **schema:** add Certificate Issuance Date attribute to GasID and RecycledID schemas ([d1c84dc](https://github.com/carrot-foundation/schemas/commit/d1c84dc08f0e82e48150e05f7d37481e4660d73f))
- **schema:** add collection, credit, methodology, mass-id-audit zod schemas ([0e6a20d](https://github.com/carrot-foundation/schemas/commit/0e6a20d5e8ed8ebbeb0aa157b2546ea6f3ac9cb3))
- **schema:** add origin country subdivision attribute to massid, gasid, and recycledid ([88c4828](https://github.com/carrot-foundation/schemas/commit/88c48287915a36a25902bc6e94612ead14bc2f94))
- **schema:** add original_content_hash to CreditPurchaseReceipt schema ([a3c6ebc](https://github.com/carrot-foundation/schemas/commit/a3c6ebc64caaa9aba56482c7ecdedea22be60d62))
- **schema:** add recycled-id zod schemas and share credit/location primitives ([1c6372e](https://github.com/carrot-foundation/schemas/commit/1c6372edf4157e6417e6b21ed513ea9860c0a688))
- **schema:** add Recycling Date attribute to GasID and RecycledID schemas ([dd9842e](https://github.com/carrot-foundation/schemas/commit/dd9842e974995502c6d6553201fffb9d0c35abb4))
- **schema:** add support for tuples by setting items to false when prefixItems are present ([ef15d0f](https://github.com/carrot-foundation/schemas/commit/ef15d0f4bcb1c9de88a52b61112f5fd419628ffb))
- **schema:** apply name validation to all NFT schemas ([8eb6a97](https://github.com/carrot-foundation/schemas/commit/8eb6a97c4d8de2178ce56460b6f5a467f62f2510))
- **schema:** change gas-id calculation date to calculated_at timestamp ([66029b2](https://github.com/carrot-foundation/schemas/commit/66029b279fee1da224f463f062ac22e208ee1fd3))
- **schema:** create CreditPurchaseReceipt schema ([21df690](https://github.com/carrot-foundation/schemas/commit/21df690dd18f7b5da83d5286dc0ad7475600f670))
- **schema:** create enums ([1ebcfe0](https://github.com/carrot-foundation/schemas/commit/1ebcfe0b1e7f5093fc5d7981a796cda6392773f4))
- **schema:** enforce unique participant rewards in CreditPurchaseReceipt schema ([2f93ad1](https://github.com/carrot-foundation/schemas/commit/2f93ad126e517a7ed6cada23c896e3283aefa2d0))
- **schema:** enhance attribute schemas and add comprehensive tests ([689123e](https://github.com/carrot-foundation/schemas/commit/689123e6b7e05b0564f2213f7fc932f5db28d9f6))
- **schema:** enhance IPFS schemas and validation patterns ([65030f0](https://github.com/carrot-foundation/schemas/commit/65030f081f368d21b7c6dd0cab07aaafe56b9e9e))
- **schema:** enhance MassID Audit schema with validation and add tests ([1f7a99d](https://github.com/carrot-foundation/schemas/commit/1f7a99d845cb8535c19280aafa671a1a33e7493c))
- **schema:** enhance validation for CreditPurchaseReceipt schema ([50cbfc9](https://github.com/carrot-foundation/schemas/commit/50cbfc9eb2e0ab9198338c84afae63b154a6f147))
- **schema:** harden mass-id validation ([58e52a8](https://github.com/carrot-foundation/schemas/commit/58e52a8fc34d68820da24d2751d7f245605d152e))
- **schema:** make viewer_reference and environment required in NFT schemas ([15e0810](https://github.com/carrot-foundation/schemas/commit/15e0810b54e8e4f24eaa6009f2f1cc5829261728))
- **schema:** migrate gas-id schema to Zod ([b692f13](https://github.com/carrot-foundation/schemas/commit/b692f13a5acd432f929776662dcf528c2eb2fda9))
- **schema:** migrate gas-id schema to Zod ([68acf19](https://github.com/carrot-foundation/schemas/commit/68acf195394cad968d7c4fd1f711e091f8bc4a2e))
- **schema:** move weight from the MassID event to each event data ([6016915](https://github.com/carrot-foundation/schemas/commit/6016915306b8d9ec979419d5eb3387b063164710))
- **schema:** remove creator field across schemas ([2ce7fbd](https://github.com/carrot-foundation/schemas/commit/2ce7fbdbfc8f79539312a1b6e467e061732e2f0e))
- **schema:** remove ens, ipns and http from viewer_reference ([f19cc15](https://github.com/carrot-foundation/schemas/commit/f19cc15235bb5561239f558ed625d98f76ad818a))
- **schema:** remove location precision level and add viewer reference to ipfs ([8e8b760](https://github.com/carrot-foundation/schemas/commit/8e8b760d7ebdc65512e8b9da97e6e45b296fc320))
- **schema:** remove participant name ([d6d5528](https://github.com/carrot-foundation/schemas/commit/d6d5528e7e73fe62fbde83c153825b05598733a2))
- **schema:** rename ipfs_cid with ipfs_uri ([9084ad6](https://github.com/carrot-foundation/schemas/commit/9084ad690ae6e54fa5aa1d66144a9b041f08640b))
- **schema:** rename original_content_hash to full_content_hash ([2827865](https://github.com/carrot-foundation/schemas/commit/28278652b1e4f22c438196c7536b899204184326))
- **schema:** rename reference uri to ipfs_uri ([90a0301](https://github.com/carrot-foundation/schemas/commit/90a03018173648f0351d10dd54c0e66c2e0c681f))
- **schema:** replace purchase-id with credit-purchase-receipt ([93adb01](https://github.com/carrot-foundation/schemas/commit/93adb01e46dfb75c6e3b16ca06bf4838badd5123))
- **schema:** update audit schemas ([3fb7e46](https://github.com/carrot-foundation/schemas/commit/3fb7e463c81d7a79bba82013a6d46eb108d0de2b))
- **schema:** update collection schema ([0440a26](https://github.com/carrot-foundation/schemas/commit/0440a262a9ee00e4f0dc4e4a9c42079eb92253b6))
- **schema:** update credit purchase and retirement receipt schemas ([f1d63df](https://github.com/carrot-foundation/schemas/commit/f1d63df71249ad85c6f5382af7e8ce341f26e7f8))
- **schema:** update date-time pattern and remove relationships from schemas ([a216189](https://github.com/carrot-foundation/schemas/commit/a216189e5eeb8b79c8296757f921c2aa5045d826))
- **schema:** update examples and validation patterns in Credit Purchase Receipt schema ([0c5eaec](https://github.com/carrot-foundation/schemas/commit/0c5eaec852af42f2df6d502d92fdf496f6ff9d7d))
- **schema:** update location precision to one decimal ([85ac1a2](https://github.com/carrot-foundation/schemas/commit/85ac1a24a092800eb0f48e66043b10a9a4a337da))
- **schema:** update location schema ([e6db43c](https://github.com/carrot-foundation/schemas/commit/e6db43c24c88abf540392f4084114faf35241efa))
- **schema:** update MassID Audit schema ([ea174b5](https://github.com/carrot-foundation/schemas/commit/ea174b560d8bd76a6660420e5cfeb8651086edee))
- **schema:** update MassID schema, fix classification system naming, add timestamp validation ([ffec760](https://github.com/carrot-foundation/schemas/commit/ffec7601fc9e0b8be630fd82075c414b66ee0a42))
- **schema:** update meta declaration order to properly handle JSON schema ([e02b961](https://github.com/carrot-foundation/schemas/commit/e02b9617469746594d7cfd45a016719932645ec1))
- **schema:** update rewards distribution schema ([0ec5c08](https://github.com/carrot-foundation/schemas/commit/0ec5c08e703925254d9aac1b4e851131248d77be))
- **schema:** update schema hashes to SHA-256 and refine descriptions ([cf569b1](https://github.com/carrot-foundation/schemas/commit/cf569b14d837d401f81ba7478289ac63c4f361db))
- **schema:** update weight attributes to include 'kg' suffix and improve descriptions ([5115aea](https://github.com/carrot-foundation/schemas/commit/5115aeaec4891f0c0c47e523abd7a436861323b6))
- **schema:** use MethodologyName schema on methodology reference ([8ce0c8e](https://github.com/carrot-foundation/schemas/commit/8ce0c8e8e2fde6cc7e84ab7a11c21f71479f5d0a))
- **shared:** add execution_message field to audit rule execution results ([69af820](https://github.com/carrot-foundation/schemas/commit/69af8203c9d0f825c3cb0df922e3de9652294d50))
- **shared:** add name validation schemas for NFT types ([773e73a](https://github.com/carrot-foundation/schemas/commit/773e73ab943e3082dfdf5af5e93f782150ff8344))
- **shared:** migrate certificate definitions to Zod ([00a1b3c](https://github.com/carrot-foundation/schemas/commit/00a1b3cfe789b65be13b5faf7b596d8398903ac1))
- **shared:** migrate reference schemas to Zod ([c908577](https://github.com/carrot-foundation/schemas/commit/c9085774f7ed7c26b5bf24e1c5febde1a8b82779))

### Bug Fixes

- address CodeRabbit review findings in AI instructions ([8996514](https://github.com/carrot-foundation/schemas/commit/89965144b1d81d2cce9606b8ad5369fb30e4885d))
- address review findings in AI instruction scripts and docs ([cd17fcb](https://github.com/carrot-foundation/schemas/commit/cd17fcb3fd7d9bb9aaaac188956f7e8d28013dce))
- close remaining gaps in schema compat checker and CI workflow ([2163d6f](https://github.com/carrot-foundation/schemas/commit/2163d6fa5159ba35e9832fa41ae0b4422324efb4))
- correct $def typo to $defs in JSON Schema cursor rule ([6d5a03d](https://github.com/carrot-foundation/schemas/commit/6d5a03d634085a6329cfc4a8a655af9156f2d6ed))
- correct casing in GasID attribute type names ([40e3447](https://github.com/carrot-foundation/schemas/commit/40e3447e352b61254f69639ec20ab72e8c670fe9))
- handle array types in schema compat checker and remove duplicate ignore ([078f874](https://github.com/carrot-foundation/schemas/commit/078f87484b71146ff32e3846f7ca304f905bfd8f))
- harden schema compat checker and CI workflows ([5897c4f](https://github.com/carrot-foundation/schemas/commit/5897c4f6081f558f0cd071933f38cf182fff2b86))
- harden schema compat checker, update actions, and fix quality gate gaps ([4f282ab](https://github.com/carrot-foundation/schemas/commit/4f282abc6c9952dc58cfe0fd3f5e061fc218bfd1))
- improve AI instruction formatting, accuracy, and pipeline order ([acfa270](https://github.com/carrot-foundation/schemas/commit/acfa27001d86742aca5f67c43381ac131c4933b8))
- replace invalid UUIDs in reference fixtures with valid RFC4122 UUIDs ([92ed54c](https://github.com/carrot-foundation/schemas/commit/92ed54c50a2e929fc355ecbefaa496d6e63b59f0))
- **schema:** fix credit-purchase-receipt test to cover missing credit branch ([c2d296e](https://github.com/carrot-foundation/schemas/commit/c2d296e02209f4b800dcae1062761b08939eff47))
- **schema:** remove redundant optional() ([e5431bd](https://github.com/carrot-foundation/schemas/commit/e5431bd5389dba36ae501e9faec854032a51f2c4))
- **schema:** update credit token symbol examples to uppercase ([a77031e](https://github.com/carrot-foundation/schemas/commit/a77031e271952144fe3dc408a9c0e6e1f383be38))
- **schema:** update Ethereum address pattern to allow lowercase hexadecimal format ([8e4ba5b](https://github.com/carrot-foundation/schemas/commit/8e4ba5bd6071d9f8080e81ce8c58f107e1b5ace7))
- **schema:** update example data with realistic values ([5073f80](https://github.com/carrot-foundation/schemas/commit/5073f80fda805cc9eab7c5e1c8ff93e2c3a9f7d0))
- **schema:** update external IDs and URLs in Credit Purchase Receipt examples ([2522c69](https://github.com/carrot-foundation/schemas/commit/2522c69449c34f646263fe5fc910676428cf76f4))
- **schema:** update gas-id imports to use correct MassIDReferenceSchema name ([492db57](https://github.com/carrot-foundation/schemas/commit/492db57be5623221e5598d9167eff175f22b36cd))
- **schema:** update hashes and remove examples for credit token symbols ([38840b5](https://github.com/carrot-foundation/schemas/commit/38840b5c1f812105cebec23407c0253d57e1b6ac))
- **schema:** update methodology name to use the proper schema ([d61c0c2](https://github.com/carrot-foundation/schemas/commit/d61c0c2ffe861c549326f828eb2f6616905c470d))
- **schema:** update recycled-id example URL and adjust sha256 pattern ([9ba01b4](https://github.com/carrot-foundation/schemas/commit/9ba01b4205b9d12d59f47bd4b9c18e54a6528653))
- **schema:** update the prevented emissions calculation formula ([54db619](https://github.com/carrot-foundation/schemas/commit/54db6192da10ecd92b494b67c6401d7c6c11702f))
- **shared:** add missing attribute and type validation to validateNumericAttributeValue ([7d2b1ad](https://github.com/carrot-foundation/schemas/commit/7d2b1ad6f446a9becff81922ca2d8eb0b5569710))
- **shared:** export certificate schemas from main package entry ([0b14509](https://github.com/carrot-foundation/schemas/commit/0b145093dbbb633bb408fcbb02cc2f35828d33ed))
- **shared:** export certificate schemas from main package entry ([b76426a](https://github.com/carrot-foundation/schemas/commit/b76426af673ec28ed2cbf9987138b37b3d1ec375))
- **shared:** export reference schemas from main package entry ([c914c7f](https://github.com/carrot-foundation/schemas/commit/c914c7f7355296fc4f5f3295d42103b1a7d36f30))
- **shared:** export reference schemas from main package entry ([e069ab0](https://github.com/carrot-foundation/schemas/commit/e069ab02022a9fa85eabe1f9bd83e07b3d129991))
- **shared:** guard against invalid z.union calls in attributes helper ([9f8fa30](https://github.com/carrot-foundation/schemas/commit/9f8fa30004be639bdb446af9e54dce682cdf9c1d))
- **shared:** preserve schema metadata and fix description duplication ([701c45f](https://github.com/carrot-foundation/schemas/commit/701c45fd64a28fa832795ce8a47c47ff19767b48))
- **shared:** use Zod v4 value property in extractTraitType ([18e14a1](https://github.com/carrot-foundation/schemas/commit/18e14a19b3c21e7dc40700781fdeda5743ed9692))
- update pattern for token symbols to allow dots in addition to hyphens ([b0cadbc](https://github.com/carrot-foundation/schemas/commit/b0cadbc0a695032f1f3303aba697c1a4700f69c5))
- update post-checkout script to check for jq and improve manifest file fetching ([33e274c](https://github.com/carrot-foundation/schemas/commit/33e274ced1af65fb59e2f26a2f099bbf89ea1988))
- update regex pattern for MassID Token ID validation ([9da11ff](https://github.com/carrot-foundation/schemas/commit/9da11ffaea27960c4dd0d1298336528651913995))

### Code Refactoring

- add barrel export ([c202273](https://github.com/carrot-foundation/schemas/commit/c202273276df2c881144f0a77789c68e5298b99e))
- align certificate fixtures with naming conventions ([6c99ae1](https://github.com/carrot-foundation/schemas/commit/6c99ae1571f9845b8b987630c818c8049e3e59ce))
- establish fixture naming conventions and refactor fixtures ([42e038a](https://github.com/carrot-foundation/schemas/commit/42e038aa6d828ee0aa2eeeb1986b7d9e8572cbc8))
- improve AI instruction scripts with shared helpers and error handling ([3223c85](https://github.com/carrot-foundation/schemas/commit/3223c850d3ab2cfb43d8916e3efa573fddbff953))
- improve type inference validation and simplify test structure ([9595721](https://github.com/carrot-foundation/schemas/commit/9595721df6128fb4a778d0a2cc3d971750e9404b))
- migrate purchase-id to zod schema ([e178d81](https://github.com/carrot-foundation/schemas/commit/e178d81c9aeb225eb5563c625943ba2004ea34d0))
- move IbamaWasteClassificationSchema to shared primitives and update imports ([9f555e8](https://github.com/carrot-foundation/schemas/commit/9f555e82ae26e8246ad1ed0c98a10df242e26336))
- remove unnecessary re-export ([7c7293f](https://github.com/carrot-foundation/schemas/commit/7c7293f4b85134963baf0db5d483856e07ccfe88))
- remove unused fixtures ([5f07666](https://github.com/carrot-foundation/schemas/commit/5f0766634817f740b1763cac6a566b140fea52ce))
- **schema:** create GasTypeSchema ([06a6977](https://github.com/carrot-foundation/schemas/commit/06a69777d36220f930b449abee5ab38f8cb20280))
- **schema:** create shared purchase and retirement receipt schemas ([ee8b55a](https://github.com/carrot-foundation/schemas/commit/ee8b55af43460c5e2b47d97f51772bcd91d36f30))
- **schema:** improve getSchemaMetadata function for better metadata retrieval ([27b3ad8](https://github.com/carrot-foundation/schemas/commit/27b3ad8ecc6d37caea4c523aa9a7cf2ad0fadb23))
- **schema:** improve shared attributes schema and helpers ([9edebfc](https://github.com/carrot-foundation/schemas/commit/9edebfcba7a37848e426e9170a537aa2cd6ed61b))
- **schema:** remove accredited_participants field from schemas ([5b39f8b](https://github.com/carrot-foundation/schemas/commit/5b39f8b52f8a5c44352d3fb5735467ab11ee74f3))
- **schema:** remove participant rewards from schemas ([1d05bf8](https://github.com/carrot-foundation/schemas/commit/1d05bf8f57899da8c8464c22a4c9e5f11019b4ea))
- **schema:** remove Recycler attribute from GasID and RecycledID schemas ([2552f08](https://github.com/carrot-foundation/schemas/commit/2552f089c7bc722d35c2cedb178cc66687ecbead))
- **schema:** remove smart_contract_address from collection schema ([47e0b99](https://github.com/carrot-foundation/schemas/commit/47e0b993aa287b50350bf8ed3ba445013aac6bf7))
- **schema:** remove unnecessary whitespace in schema files ([6d2a03f](https://github.com/carrot-foundation/schemas/commit/6d2a03fd9368edac792a7f61e89270a06d2a9caf))
- **schema:** rename IsoTimestamp to IsoDateTime ([9dadd34](https://github.com/carrot-foundation/schemas/commit/9dadd3438fa808daac38d114f9e4194f2a06132a))
- **schema:** rename net_weight_kg to weight_kg ([fde3e9c](https://github.com/carrot-foundation/schemas/commit/fde3e9c5e61c2d640a120cf44de26c3d919fe877))
- **schema:** rename Recycled Mass Weight to Recycled Weight ([b410767](https://github.com/carrot-foundation/schemas/commit/b41076720de30af722ab0bae865d1917cd7e9139))
- **schema:** rename report_uri to ipfs_uri in AuditReferenceSchema ([d976b5a](https://github.com/carrot-foundation/schemas/commit/d976b5a1efa1e07a106b08505a63b89c117ca170))
- **schema:** rename WasteClassification to WasteProperties and update related references ([0bef409](https://github.com/carrot-foundation/schemas/commit/0bef40956655cc2cde691d93c16e8ea98d5d1623))
- **schema:** replace CreditPurchaseReceiptExternalIdSchema with ExternalIdSchema ([4a5a920](https://github.com/carrot-foundation/schemas/commit/4a5a920c583f27864da4795e1f4a89ec992be9eb))
- **schema:** replace CreditRetirementReceiptExternalIdSchema with ExternalIdSchema ([1101811](https://github.com/carrot-foundation/schemas/commit/1101811058cd598406f9e3cf9f0cfa213cf53cf8))
- **schema:** replace extend with safeExtend ([51a48cd](https://github.com/carrot-foundation/schemas/commit/51a48cd0494c43efe32530cbfe6395c65dac8ba0))
- **schema:** replace extend with safeExtend for MassIDReference schema ([678dc88](https://github.com/carrot-foundation/schemas/commit/678dc88971e868d02b16302438a9d1bd9a283074))
- **schema:** replace string validation with z.iso for ISO 8601 timestamps ([c90a2c4](https://github.com/carrot-foundation/schemas/commit/c90a2c41f7e555dc6576da6486c0910d5d84be2b))
- **schema:** simplify MassID attributes description for clarity ([13319b9](https://github.com/carrot-foundation/schemas/commit/13319b9f28d02047e80b2993fb15ffdd325fc438))
- **schema:** standardize naming conventions for MassID schemas ([3dd18ca](https://github.com/carrot-foundation/schemas/commit/3dd18ca58da2b155e5f4a46731fab7c5a73398ba))
- **shared:** centralize certificate schema test fixtures ([267e34b](https://github.com/carrot-foundation/schemas/commit/267e34bad9e9de2ef8cf410ed124dc342caf8521))
- **shared:** export all shared schemas from main entry ([a64ff76](https://github.com/carrot-foundation/schemas/commit/a64ff764e8ba1f16c7790cfe3445808b0bfedd7f))
- **shared:** export all shared schemas from main entry ([5561b34](https://github.com/carrot-foundation/schemas/commit/5561b340e220239a23296ac9e4a296542738f363))
- **shared:** extract attribute helpers into separate file ([347524b](https://github.com/carrot-foundation/schemas/commit/347524b7e6228a16e00d77896f58052c4d1b30f8))
- **shared:** extract validation helpers and remove unreachable defensive code ([1e2e2a0](https://github.com/carrot-foundation/schemas/commit/1e2e2a04c98a933862f7b5f16927e9a92fe10a34))
- **shared:** move full_content_hash from BaseIpfsSchema to NftIpfsSchema ([8be1707](https://github.com/carrot-foundation/schemas/commit/8be1707e00f2531e6aeb58faefaf30442a62d292))
- **shared:** move reference fixtures to centralized location ([e114060](https://github.com/carrot-foundation/schemas/commit/e11406036fde519120a88414b6d72abb0d800539))
- **shared:** move reference fixtures to centralized location ([b7a46ce](https://github.com/carrot-foundation/schemas/commit/b7a46ceaa20cebe725c3bde0cc2c0dc75d462e20))
- **shared:** remove content_hash from base IPFS schema ([168438c](https://github.com/carrot-foundation/schemas/commit/168438c792eac6c057a1740a81a52a2e5f43ba2f))
- **shared:** rename full_content_hash to audit_data_hash ([9a1e7be](https://github.com/carrot-foundation/schemas/commit/9a1e7be8967dfdb577ff5804984326671b461970))
- **shared:** standardize token reference schemas with smart_contract_address ([8c49e25](https://github.com/carrot-foundation/schemas/commit/8c49e25da76ae6cfcca6ced5a337f02dbde5e84c))
- **shared:** update shared folder file structure ([5b07514](https://github.com/carrot-foundation/schemas/commit/5b075148eaafff3ad7e518b60b7da29983eaf695))
- simplify validation logic by removing schema stripping ([86d0d77](https://github.com/carrot-foundation/schemas/commit/86d0d778f3c4135e762b52604148bf8b6d62e2c3))
- standardize imports in gas-id and mass-id schemas ([f313f26](https://github.com/carrot-foundation/schemas/commit/f313f26c93cbf9eb0e1a99a72b8edce5b26c6aad))
- update massID case ([aa7526d](https://github.com/carrot-foundation/schemas/commit/aa7526d278a7ea3af903b0f7ffa23ebd8cd46539))
