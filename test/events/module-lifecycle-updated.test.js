const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const rootDir = path.resolve(__dirname, "../..");

function loadJson(relativePath) {
    const filePath = path.join(rootDir, relativePath);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

ajv.addSchema(
    loadJson("schemas/events/event-envelope.schema.json")
);

ajv.addSchema(
    loadJson("schemas/errors/error-envelope.schema.json")
);

const schema = loadJson(
    "schemas/events/module-lifecycle-updated.schema.json"
);

const validate = ajv.compile(schema);

const validExamples = [
    {
        file: "examples/events/module-lifecycle-ready.json",
        description: "READY event"
    },
    {
        file: "examples/events/module-lifecycle-failed.json",
        description: "FAILED event with error"
    }
];

const invalidExamples = [
    {
        file: "examples/events/module-lifecycle-failed-without-error.json",
        description: "FAILED event without error"
    },
    {
        file: "examples/events/module-lifecycle-ready-with-error.json",
        description: "READY event with error"
    },
    {
        file: "examples/events/module-lifecycle-invalid-status.json",
        description: "Event with invalid status"
    },
    {
        file: "examples/events/module-lifecycle-missing-correlation-id.json",
        description: "Event without correlationId"
    }
];

for (const example of validExamples) {
    test(`accepts ${example.description}`, () => {
        const data = loadJson(example.file);
        const valid = validate(data);

        assert.equal(
            valid,
            true,
            `Expected ${example.file} to be valid.\n${JSON.stringify(
                validate.errors,
                null,
                2
            )}`
        );
    });
}

for (const example of invalidExamples) {
    test(`rejects ${example.description}`, () => {
        const data = loadJson(example.file);
        const valid = validate(data);

        assert.equal(
            valid,
            false,
            `Expected ${example.file} to be invalid, but it was accepted.`
        );
    });
}