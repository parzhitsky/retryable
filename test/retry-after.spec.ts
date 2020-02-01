import retryable from "../src/retryable";
import { time, TIMEOUT_MARGIN, WAIT_TIME } from "./helpers/time";

describe("retry.after()", () => {
	it("allows retrying after a specified delay", async () => {
		let retried = false;

		const finish = time() + time(WAIT_TIME);

		await retryable((resolve, reject, retry) => {
			if (retried)
				resolve();

			else {
				retried = true;

				retry.after(WAIT_TIME);
			}
		});

		expect(time()).toBeCloseTo(finish);
		expect(retried).toBe(true);
	}, TIMEOUT_MARGIN + WAIT_TIME);

	it("forbids negative delays", async () => {
		try {
			await retryable((resolve, reject, retry) => {
				retry.after(-14);
			});

			fail("Function did not throw");
		} catch (error) {
			expect(error.message).toContain("a negative number");
		}
	});

	it("allows positive non-integer delays", () => {
		let retried = false;

		const promise = retryable((resolve, reject, retry) => {
			if (retried)
				return resolve();

			retried = true;
			retry.after(42.17);
		});

		expect(promise).resolves.toBeUndefined();
	});
});
