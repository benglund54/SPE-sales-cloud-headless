// Route entry for /sales-cloud: loads the styles (the shell reuses the existing
// .tms-* rules from sony.css, unchanged) and renders the experience. Kept
// separate from the component so the component stays importable without CSS.
import '../sony/sony.css';
import './sales-cloud.css';
import { SalesCloudExperience } from './SalesCloudExperience';

export default function SalesCloudRoute() {
  return <SalesCloudExperience />;
}
