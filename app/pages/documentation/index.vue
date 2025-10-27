<template>
    <div>

        <header>
            <h1>Documentation</h1>
        </header>

        <main class="h-screen w-screen flex justify-center items-center" >

            <div>

            </div>

            <div>
                <PanelMenu :model="items" />
            </div>

        </main>

    </div>
</template>

<script setup lang="ts">
const { newDocumentation, isLoading } = useDocumentation();



onMounted(async () => {
    const cid = await newDocumentation();
    if ( cid ) {
        console.log(cid);
    }
});
</script>