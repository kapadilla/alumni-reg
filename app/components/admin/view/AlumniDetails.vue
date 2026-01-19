<script setup lang="ts">
import type { ApplicantDetails } from "~/types";
import { mentorshipFormatOptions } from "~/types/registration";
import { format } from "date-fns";

interface Props {
  applicant: ApplicantDetails | null;
}

const props = defineProps<Props>();

const fullName = computed(() => {
  if (!props.applicant?.personalDetails) return "";
  const { firstName, middleName, lastName, suffix } =
    props.applicant.personalDetails;
  const middle = middleName ? ` ${middleName}` : "";
  return `${firstName}${middle} ${lastName}${suffix ? " " + suffix : ""}`;
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "MMMM d, yyyy");
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateStr;
  }
};

const getMentorshipFormatLabel = (value?: string | null) => {
  if (!value) return "N/A";
  const option = mentorshipFormatOptions.find((opt) => opt.value === value);
  return option?.label || value;
};

const processedMentorshipAreas = computed(() => {
  if (!props.applicant?.mentorship?.mentorshipAreas) return [];
  const areas: string[] = [];
  for (const area of props.applicant.mentorship.mentorshipAreas) {
    if (area === "other" && props.applicant.mentorship.mentorshipAreasOther) {
      const otherItems = props.applicant.mentorship.mentorshipAreasOther
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
      areas.push(...otherItems);
    } else if (area !== "other") {
      areas.push(area);
    }
  }
  return areas;
});

const processedIndustryTracks = computed(() => {
  if (!props.applicant?.mentorship?.mentorshipIndustryTracks) return [];
  const tracks: string[] = [];
  for (const track of props.applicant.mentorship.mentorshipIndustryTracks) {
    if (
      track === "other" &&
      props.applicant.mentorship.mentorshipIndustryTracksOther
    ) {
      const otherItems =
        props.applicant.mentorship.mentorshipIndustryTracksOther
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0)
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1));
      tracks.push(...otherItems);
    } else if (track !== "other") {
      tracks.push(track);
    }
  }
  return tracks;
});
</script>

<template>
  <div v-if="applicant" class="space-y-8">
    <!-- Header info -->
    <div
      class="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10"
    >
      <div
        class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"
      >
        <Icon name="material-symbols:person" class="size-6" />
      </div>
      <div>
        <h4 class="font-semibold text-text text-lg">
          {{ fullName }}
        </h4>
        <p class="text-sm text-subtle">
          {{ applicant.personalDetails.email }}
        </p>
      </div>
      <div class="ml-auto flex flex-col items-end">
        <span class="text-xs text-subtle">Date Applied</span>
        <span class="font-medium text-text">{{
          formatDate(applicant.dateApplied)
        }}</span>
      </div>
    </div>

    <!-- Personal details -->
    <section>
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Personal Details
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Date of Birth</label>
          <div class="font-medium">
            <template v-if="applicant.personalDetails.dateOfBirth">
              {{ formatDate(applicant.personalDetails.dateOfBirth) }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Mobile Number</label>
          <div class="font-medium">
            <template v-if="applicant.personalDetails.mobileNumber">
              {{ applicant.personalDetails.mobileNumber }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-xs text-subtle mb-1">Current Address</label>
          <div class="font-medium text-text">
            {{ applicant.personalDetails.currentAddress }},
            {{ applicant.personalDetails.barangay }},
            {{ applicant.personalDetails.city }},
            {{ applicant.personalDetails.province }}
            {{ applicant.personalDetails.zipCode }}
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Status -->
    <section>
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Academic Information
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Degree Program</label>
          <div class="font-medium">
            <template v-if="applicant.academicStatus.degreeProgram">
              {{ applicant.academicStatus.degreeProgram }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Year Graduated</label>
          <div class="font-medium">
            <template v-if="applicant.academicStatus.yearGraduated?.length">
              {{ applicant.academicStatus.yearGraduated }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Student Number</label>
          <div class="font-medium">
            <template v-if="applicant.academicStatus.studentNumber">
              <span
                class="font-mono bg-background px-2 py-0.5 rounded inline-block"
                >{{ applicant.academicStatus.studentNumber }}</span
              >
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Status -->
    <section>
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Professional Information
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-xs text-subtle mb-1">Current Employer</label>
          <div class="font-medium">
            <template v-if="applicant.professional.currentEmployer">
              {{ applicant.professional.currentEmployer }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Job Title</label>
          <div class="font-medium">
            <template v-if="applicant.professional.jobTitle">
              {{ applicant.professional.jobTitle }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Industry</label>
          <div class="font-medium">
            <template v-if="applicant.professional.industry">
              {{ applicant.professional.industry }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Mentorship Program -->
    <section v-if="applicant.mentorship?.joinMentorshipProgram">
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Mentorship Program
      </h5>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-xs text-subtle mb-1"
            >Areas of Interest</label
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="area in processedMentorshipAreas"
              :key="area"
              class="px-2 py-1 text-sm bg-primary/10 text-primary rounded-md"
            >
              {{ area }}
            </span>
            <span
              v-if="!processedMentorshipAreas.length"
              class="text-subtle italic"
              >N/A</span
            >
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-subtle mb-1">Industry Tracks</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="track in processedIndustryTracks"
              :key="track"
              class="px-2 py-1 text-sm bg-secondary/10 text-secondary rounded-md"
            >
              {{ track }}
            </span>
            <span
              v-if="!processedIndustryTracks.length"
              class="text-subtle italic"
              >N/A</span
            >
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Preferred Format</label>
          <div class="font-medium">
            <template v-if="applicant.mentorship?.mentorshipFormat">
              {{
                getMentorshipFormatLabel(applicant.mentorship.mentorshipFormat)
              }}
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
        <div>
          <label class="block text-xs text-subtle mb-1">Availability</label>
          <div class="font-medium">
            <template v-if="applicant.mentorship?.mentorshipAvailability">
              {{ applicant.mentorship.mentorshipAvailability }} hours per month
            </template>
            <span v-else class="text-subtle italic">N/A</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Application History -->
    <section v-if="applicant.history?.length">
      <h5
        class="text-xs font-bold text-subtle uppercase tracking-wider mb-4 border-b border-border pb-2"
      >
        Application History
      </h5>
      <div class="relative space-y-0">
        <div
          v-for="(entry, index) in applicant.history"
          :key="index"
          class="relative flex gap-4"
        >
          <!-- Timeline column -->
          <div class="flex flex-col items-center">
            <div
              class="size-3 rounded-full ring-4 ring-surface shrink-0 mt-1 bg-primary/30"
            />
            <div
              v-if="index < (applicant.history?.length ?? 0) - 1"
              class="w-0.5 flex-1 bg-border/50 my-1"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 pb-6">
            <div
              class="flex flex-col sm:flex-row sm:items-start justify-between gap-2"
            >
              <div>
                <p class="font-medium text-text capitalize">
                  {{ entry.action.replace(/_/g, " ") }}
                </p>
                <p class="text-sm text-subtle">
                  <template
                    v-if="entry.performedByName?.toLowerCase() === 'system'"
                  >
                    <span class="text-text">System</span>
                  </template>
                  <template v-else>
                    By
                    <span class="text-text">{{ entry.performedByName }}</span>
                  </template>
                </p>
                <p
                  v-if="entry.notes"
                  class="mt-2 text-sm text-text/80 bg-background p-2 rounded border border-border italic"
                >
                  "{{ entry.notes }}"
                </p>
              </div>
              <span class="text-xs text-subtle whitespace-nowrap">
                {{ formatDateTime(entry.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else class="text-center py-12 text-subtle">
    No applicant details available.
  </div>
</template>
