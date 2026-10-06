<script setup lang="ts">
const team = [
  {
    name: 'Peter Gallagher',
    role: 'P.I.',
    detail: 'Senior Professor & Head of Astronomy & Astrophysics Section, Dublin Institute for Advanced Studied (DIAS)',
  },
  { name: 'Alasdair Wilson', role: 'Developer', detail: 'Research Software Engineer, University of Oxford' },
  {
    name: 'Shane Maloney',
    role: 'Developer',
    detail: 'Post-doctoral Research Fellow, Dublin Institute for Advanced Studied (DIAS)',
  },
  { name: 'Sophie Murray', role: 'Developer', detail: 'Technical Officer, Dublin Institute for Advanced Studied (DIAS)' },
  { name: 'David Connolly', role: 'Developer', detail: 'Undergraduate Student in Physics and Data Science' },
  { name: 'Imogen Nagle', role: 'Developer', detail: 'Undergraduate Student in Physics' },
  {
    name: 'Paul Wright',
    role: 'Developer',
    detail: 'Post-doctoral Research Fellow, Dublin Institute for Advanced Studied (DIAS)',
  },
]

const alumni = [
  'Eoin Carley',
  'Ruth Moore',
  "Oscar O'Hara",
  'Aoife McCloskey',
  'Iain Billett',
  'Simon Free',
  "David O'Callaghan",
  'David Pérez-Suárez',
  'D. Shaun Bloomfield',
  'R. T. James McAteer',
  'Donna Rogers-Lee',
  'Russell J. Hewett',
]
</script>

<template>
  <div class="about-section">
    <h1 class="pt-3">About Us</h1>
    <p>
      Welcome to SolarMonitor.org, hosted and developed by a team of researchers within the Solar Physics Group at the
      Dublin Institute for Advanced Studies. These pages contain near-realtime and archived images, timeseries data and
      other information on active regions and solar activity.
    </p>
    <p>
      Launched in 2001, SolarMonitor has undergone numerous frontend and backend redesigns. Due to the websites
      extensive history the IDL source code became outdated and thus increasingly difficult to maintain. In 2020 the
      Python redevelopment of old SolarMonitor from the ground up began.
    </p>
    <p>
      This site is a work in progress, with new features and data sources are added regularly. Feedback can be provided
      by posting an issue to our
      <a href="https://github.com/solarmonitor/solarmonitor2/issues">github issue tracker</a>, by emailing
      <a href="mailto:solarmonitor@dias.ie">the SolarMonitor Team</a>, or by tweeting us
      <a href="https://twitter.com/solarmonitororg">@solarmonitororg</a>.
    </p>

    <h2 class="pt-3">Our Team</h2>
    <div class="row row-cols-3 g-4 d-flex">
      <div v-for="member in team" :key="member.name" class="col">
        <div class="card h-100 d-flex flex-column">
          <div class="card-body text-center">
            <h4 class="card-title">{{ member.name }}</h4>
            <h6 class="title">{{ member.role }}</h6>
            <p class="card-text">{{ member.detail }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="alumni">
    <h3 class="pt-3">Alumni</h3>
    <div class="row row-cols-4 g-4 d-flex">
      <div v-for="name in alumni" :key="name" class="col">
        <div class="card h-100 d-flex flex-column">
          <div class="card-body text-center">
            <h4 class="card-title">{{ name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="acknowledgments">
    <h1 class="pt-3">Acknowledgments</h1>
    <p>
      It would be appreciated if publications based on data downloaded from these pages would acknowledge
      SolarMonitor.org and the relevant initial data source listed below. Suggested acknowledgement: "Data supplied
      courtesy of SolarMonitor".
    </p>
    <h2 class="pt-3">Data</h2>
    <ul>
      <li>
        NOAA Solar Region Summaries, Solar Event Lists, GOES X-rays, proton and electron data from the NOAA Space
        Weather Prediction Center.
      </li>
      <li>
        SDO Data supplied courtesy of the SDO/HMI and SDO/AIA consortia. SDO is the first mission to be launched for
        NASA's Living With a Star (LWS) Program.
      </li>
      <li>SUVI data are supplied by the NOAA National Centers for Environmental Information (NCEI).</li>
      <li>
        STIX data are provided by Solar Orbiter, a space mission of international collaboration between ESA and NASA,
        operated by ESA
      </li>
    </ul>
    <h2 class="pt-3">Software</h2>
    <p>SolarMonitor makes extensive use of open-source software packages:</p>
    <ul>
      <li>
        <a href="https://www.sunpy.org">Sunpy</a> is a community-developed, free and open-source solar data analysis
        environment for Python. SolarMonitor makes use of Sunpy, and Sunpy affiliated packages, for plotting and data
        retrieval.
      </li>
      <li>
        SolarMonitor makes use of <a href="https://www.astropy.org">Astropy:</a> a community-developed core Python
        package and an ecosystem of tools and resources for astronomy
      </li>
    </ul>
  </div>

  <footer class="footer mt-auto py-3">
    <div class="container-fluid text-center">
      <hr />
      <img
        class="p-3"
        src="https://www.dias.ie/wp-content/uploads/2019/01/DIAS_RGB-2-1800x863.png"
        alt="DIAS logo"
        style="width: 200px"
      />
    </div>
  </footer>
</template>
