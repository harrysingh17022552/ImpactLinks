import { envList } from "../envConfig.js";
import app from "./app.js";
import { startDrawJob } from "./jobs/drawJob.js";
const PORT = envList.PORT || 5000;
startDrawJob();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
