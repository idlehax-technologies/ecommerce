import { ESLintUtils } from "@typescript-eslint/utils";

const createRule =
    ESLintUtils.RuleCreator.withoutDocs;

function isPromiseType(type) {
    if (type.isUnion()) {
        return type.types.some(
            isPromiseType
        );
    }

    return (
        type.getSymbol()?.name ===
        "Promise"
    );
}

export default createRule({
    name: "explicit-await",

    meta: {
        type: "problem",

        docs: {
            description:
                "Require every Promise-returning function call to be explicitly awaited.",
        },

        schema: [],

        messages: {
            missingAwait:
                "Promise-returning function calls must be explicitly awaited.",
        },
    },

    defaultOptions: [],

    create(context) {
        const services =
            ESLintUtils.getParserServices(
                context
            );

        const checker =
            services.program.getTypeChecker();

        return {
            CallExpression(node) {
                const tsNode =
                    services.esTreeNodeToTSNodeMap.get(
                        node
                    );

                const type =
                    checker.getTypeAtLocation(
                        tsNode
                    );

                if (!isPromiseType(type)) {
                    return;
                }

                const parent = node.parent;

                if (
                    parent?.type ===
                    "AwaitExpression" &&
                    parent.argument === node
                ) {
                    return;
                }

                context.report({
                    node,
                    messageId: "missingAwait",
                });
            },
        };
    },
});