<script setup lang="ts">
import AppButton from "../../components/ui/AppButton.vue";
import SecondaryButton from "../../components/ui/SecondaryButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="relative flex flex-col bg-white">
    <div class="relative h-screen">
      <header class="flex justify-between items-center px-12 py-10">
        <h1
          class="text-2xl font-semibold cursor-pointer"
          @click="router.push('/home')"
        >
          Brain Game Center
        </h1>
        <SecondaryButton class="px-8" @click="router.push('/login')"
          >Login</SecondaryButton
        >
      </header>

      <main class="flex-1 flex items-center px-12 py-32">
        <div class="max-w-2xl z-10">
          <h2 class="text-4xl font-bold mb-6">
            Advancing the understanding of brain health through interactive
            technologies
          </h2>
          <p class="text-lg mb-8">
            <!-- eslint-disable-next-line no-irregular-whitespace -->
            The Brain Game Center for Mental Fitness and Well-Being designs
            interactive experiences for diverse populations to transform how we
            think about mental fitness and well-being.
          </p>
          <AppButton class="px-8" @click="router.push('/signup')">
            Sign Up
          </AppButton>
        </div>
      </main>
      <div class="absolute right-0 top-[70%] -translate-y-1/2 h-full">
        <ElImage
          src="/icons/bgc-logo.svg"
          class="w-full h-full"
          fit="contain"
        />
      </div>
    </div>

    <section class="flex items-center gap-16 px-12 py-24">
      <div class="flex-1 max-w-2xl">
        <h2 class="text-4xl font-bold mb-6">
          A cross-disciplinary team devoted to improving lives across all age
          groups
        </h2>
        <p class="text-lg mb-8">
          Our team conducts groundbreaking research, rigorous testing, and
          <!-- eslint-disable-next-line no-irregular-whitespace -->
          widespread distribution of scientifically refined software to help
          numerous people address their cognitive needs and reach their
          cognitive goals.
        </p>
      </div>
      <ElImage src="/home-photo-1.svg"></ElImage>
    </section>

    <section class="px-12">
      <h2 class="text-5xl font-bold mb-16">Our Team</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div class="flex flex-col">
          <ElImage src="/aaron-seitz.svg"></ElImage>
          <h3 class="text-xl font-bold mb-2 mt-4">Aaron Seitz, Ph.D</h3>
          <p class="text-sm">
            Principal Investigator at the Northeastern Brain Game Center &
            SoundMind Collaboratory
          </p>
        </div>
        <div class="flex flex-col">
          <ElImage src="/susanne-jaeggi.svg"></ElImage>
          <h3 class="text-xl font-bold mb-2 mt-4">Susanne Jaeggi, Ph.D</h3>
          <p class="text-sm">
            Principal Investigator at the Northeastern Brain Game Center &
            SoundMind Collaboratory
          </p>
        </div>
        <div class="flex flex-col">
          <ElImage src="/anja-pahor.svg"></ElImage>
          <h3 class="text-xl font-bold mb-2 mt-4">Anja Pahor, Ph.D</h3>
          <p class="text-sm">
            Affiliate Assistant Professor at Northeastern University Department
            of Psychology in the College of Science
          </p>
        </div>
        <div class="flex flex-col">
          <ElImage src="/jaap-munneke.svg"></ElImage>
          <h3 class="text-xl font-bold mb-2 mt-4">Jaap Munneke, Ph.D</h3>
          <p class="text-sm">
            Assistant Research Professor and Associate Director at the
            Northeastern Brain Game Center & SoundMind Collaboratory
          </p>
        </div>
      </div>
    </section>

    <section class="flex items-center gap-16 px-12 py-40">
      <ElImage src="/home-photo-2.svg"></ElImage>
      <div class="flex-1 max-w-2xl">
        <h2 class="text-4xl font-bold mb-6">
          Pairing interdisciplinary research with interactive experiences
        </h2>
        <p class="text-lg mb-8">
          Our mission is to research, test, and disseminate evidence-based,
          scientifically optimized applications to benefit real-life cognitive
          challenges—from how we see and hear, to our abilities to focus and
          remember, to how we make decisions, to how we learn and successfully
          tackle everyday problems.
        </p>
      </div>
    </section>

    <footer class="bg-black">
      <div class="grid grid-cols-1 md:grid-cols-4 px-12 py-12 items-start">
        <div
          class="flex items-center gap-4 cursor-pointer"
          @click="router.push('/home')"
        >
          <ElImage src="/bgc-footer-logo.svg"></ElImage>
          <h1 class="text-xl font-semibold text-white">Brain Game Center</h1>
        </div>

        <div>
          <h3 class="text-md text-white font-semibold mb-4">Contact</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-4">
              <ElImage src="/email-footer-icon.svg"></ElImage>
              <p class="text-white">
                <a href="mailto:bgc@northeastern.edu">bgc@northeastern.edu</a>
              </p>
            </div>
            <div class="flex items-center gap-4">
              <ElImage src="/phone-footer-icon.svg"></ElImage>
              <p class="text-white">123-323-2389</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-md text-white font-semibold mb-4">Location</h3>
          <div class="flex items-start gap-4">
            <ElImage src="/location-footer-icon.svg"></ElImage>
            <div>
              <p class="text-white">360 Huntington Avenue</p>
              <p class="text-white">Boston, MA 02115</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-md text-white font-semibold mb-4">Our Funders</h3>
          <div>
            <p class="text-white">AERDF | ONR | NIH | NEI | NIA | NIDCD</p>
            <p class="text-white">NIDDK | NIMH | NSF</p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-white py-8">
          Made by students @
          <a href="https://www.sandboxnu.com/" target="_blank">Sandbox</a>
        </p>
      </div>
    </footer>
  </div>
</template>
