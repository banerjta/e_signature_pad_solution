import { DefaultProfile } from "./default-profile.js";
import { TopazSignaturePadTLBK460BSBProfile } from "./TLBK460-BSB-profile.js";
import { TopazSignaturePadTLBK755BHSBProfile } from "./TLBK755-BHSB-profile.js";
import { TopazSignaturePadTLBK57GCBHSXProfile } from "./TLBK57GC-BHSX-profile.js";
import { TopazSignaturePadTLBK766SEBHSXProfile } from "./TLBK766SE-BHSX-profile.js";
import { TopazSignaturePadTLBK462BSBProfile } from "./TLBK462-BSB-profile.js";
import { TopazSignaturePadTLBK755SEBHSBProfile } from "./TLBK755SE-BHSB-profile.js";
import { TopazSignaturePadTLBK57GCBBSBProfile } from "./TLBK57GC-BBSB-profile.js";
import { TopazSignaturePadTLBKHSXProfile } from "./HSX-profile.js";
import { TopazSignaturePadTLBK57GCBHSBProfile } from "./TLBK57GC-BHSB-R-profile.js";
import { TopazSignaturePadTLBK755SEBBSBProfile } from "./TLBK755SE-BBSB-profile.js";
import { TopazSignaturePadTLBK766SEBBSBProfile } from "./TLBK766SE-BBSB-profile.js";
import { TopazSignaturePadTLBK755BBSBProfile } from "./TLBK755-BBSB-profile.js";
import { TopazSignaturePadTLBK462HSBProfile } from "./TLBK462-HSB-profile.js";

export const profiles = [
  Object.freeze({
    LABEL: "T-LBK462-BSB-R",
    PROFILE: TopazSignaturePadTLBK462BSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK462-HSX/T-LBK460-HSB/T-S460-HSX/T-S460-HSB/T-LBK460-HSX",
    PROFILE: TopazSignaturePadTLBKHSXProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK755SE-BBSB-R",
    PROFILE: TopazSignaturePadTLBK755SEBBSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK755-BBSB-R",
    PROFILE: TopazSignaturePadTLBK755BBSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK766SE-BBSB-R",
    PROFILE: TopazSignaturePadTLBK766SEBBSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK766SE-BHSX-R/T-LBK766SE-BHSB-R",
    PROFILE: TopazSignaturePadTLBK766SEBHSXProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK755SE-BHSB-R",
    PROFILE: TopazSignaturePadTLBK755SEBHSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK755-BHSB-R",
    PROFILE: TopazSignaturePadTLBK755BHSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK460-BSB-R/T-S460-BSB-R",
    PROFILE: TopazSignaturePadTLBK460BSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK57GC-BHSB-R",
    PROFILE: TopazSignaturePadTLBK57GCBHSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK57GC-BHSX-R",
    PROFILE: TopazSignaturePadTLBK57GCBHSXProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK57GC-BBSB-R",
    PROFILE: TopazSignaturePadTLBK57GCBBSBProfile,
  }),
  Object.freeze({
    LABEL: "T-LBK462-HSB-R",
    PROFILE: TopazSignaturePadTLBK462HSBProfile,
  }),
  Object.freeze({
    LABEL: "default profile",
    PROFILE: DefaultProfile,
  }),
];