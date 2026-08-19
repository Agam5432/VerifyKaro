/**
 * VerifyKaro — Evaluation Runner
 * --------------------------------
 * Runs the evaluation dataset against
 * the real /verify API.
 *
 * This is an evaluation/regression tool.
 * It does NOT modify production scoring logic.
 */

const EVALUATION_DATASET = require("./evaluation.dataset");

const API_URL =
  process.env.VERIFY_API_URL ||
  "http://localhost:5000/api/verify";

async function runEvaluation() {
  console.log("\n========================================");
  console.log("        VerifyKaro Evaluation");
  console.log("========================================\n");

  console.log(`Test cases: ${EVALUATION_DATASET.length}`);
  console.log(`API: ${API_URL}\n`);

  let passed = 0;
  let failed = 0;

  const signalStats = {};

  for (const testCase of EVALUATION_DATASET) {
    process.stdout.write(
      `[${testCase.id}] ${testCase.category} ... `
    );

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: testCase.text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || `HTTP ${response.status}`
        );
      }

      // --------------------------------------------
      // ANALYSIS FAILURE
      // --------------------------------------------

      if (data.analysisComplete === false) {
        failed++;

        console.log("FAIL");
        console.log(
          "   AI analysis did not complete."
        );

        continue;
      }

      const actualRisk = data.riskLevel;

      const actualSignals = new Set(
        (data.evidence || []).map(
          (item) => item.key
        )
      );

      const expectedSignals = new Set(
        testCase.expectedSignals
      );

      // --------------------------------------------
      // RISK CHECK
      // --------------------------------------------

      const riskPassed =
        actualRisk === testCase.expectedRisk;

      // --------------------------------------------
      // SIGNAL CHECK
      // --------------------------------------------

      const missingSignals =
        testCase.expectedSignals.filter(
          (signal) =>
            !actualSignals.has(signal)
        );

      const unexpectedSignals =
        [...actualSignals].filter(
          (signal) =>
            !expectedSignals.has(signal)
        );

      const signalsPassed =
        missingSignals.length === 0;

      // --------------------------------------------
      // FINAL CASE RESULT
      // --------------------------------------------

      const testPassed =
        riskPassed && signalsPassed;

      if (testPassed) {
        passed++;

        console.log("PASS");

      } else {
        failed++;

        console.log("FAIL");

        console.log(
          `   Expected risk : ${testCase.expectedRisk}`
        );

        console.log(
          `   Actual risk   : ${actualRisk}`
        );

        if (missingSignals.length > 0) {
          console.log(
            `   Missing signals: ${missingSignals.join(
              ", "
            )}`
          );
        }

        if (unexpectedSignals.length > 0) {
          console.log(
            `   Unexpected signals: ${unexpectedSignals.join(
              ", "
            )}`
          );
        }
      }

      // --------------------------------------------
      // SIGNAL STATISTICS
      // --------------------------------------------

      for (const signal of testCase.expectedSignals) {
        if (!signalStats[signal]) {
          signalStats[signal] = {
            expected: 0,
            detected: 0,
          };
        }

        signalStats[signal].expected++;

        if (actualSignals.has(signal)) {
          signalStats[signal].detected++;
        }
      }
    } catch (error) {
      failed++;

      console.log("ERROR");

      console.log(
        `   ${error.message}`
      );
    }
  }

  // ----------------------------------------------
  // SUMMARY
  // ----------------------------------------------

  const total =
    passed + failed;

  const accuracy =
    total > 0
      ? ((passed / total) * 100).toFixed(2)
      : "0.00";

  console.log("\n========================================");
  console.log("              SUMMARY");
  console.log("========================================\n");

  console.log(`Total Tests : ${total}`);
  console.log(`Passed      : ${passed}`);
  console.log(`Failed      : ${failed}`);
  console.log(`Accuracy    : ${accuracy}%`);

  // ----------------------------------------------
  // SIGNAL PERFORMANCE
  // ----------------------------------------------

  console.log(
    "\n----------------------------------------"
  );

  console.log("Signal Detection");
  console.log(
    "----------------------------------------\n"
  );

  const signalNames =
    Object.keys(signalStats);

  if (signalNames.length === 0) {
    console.log(
      "No expected signals were evaluated."
    );
  }

  for (const signal of signalNames) {
    const stats =
      signalStats[signal];

    const detectionRate =
      (
        (stats.detected /
          stats.expected) *
        100
      ).toFixed(2);

    console.log(
      `${signal.padEnd(
        28
      )} ${stats.detected}/${stats.expected} (${detectionRate}%)`
    );
  }

  console.log(
    "\n========================================\n"
  );

  // ----------------------------------------------
  // CI / REGRESSION SUPPORT
  // ----------------------------------------------

  if (failed > 0) {
    process.exitCode = 1;
  }
}

runEvaluation();