// @ts-check

// Scoped CSS component
// https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
// Influenced by https://x.com/dburles/status/1848236095173226873

/**
 * A component that provides CSS scoping functionality
 * @param {Object} props - The component props
 * @param {string} [props.href] - Optional URL to an external stylesheet
 * @param {string} [props.css] - Optional CSS string to scope
 * @param {React.ReactNode} [props.children] - Child elements to scope the styles to
 * @returns {JSX.Element} The scoped component
 */
const Scope = ({ href, css, children }) => {
  return (
    <ultra-scope style={{ display: "contents" }}>
      {href && <link rel="stylesheet" href={href} />}
      {css && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@scope {
                       ${css}
                     }`,
          }}
        />
      )}
      {children}
    </ultra-scope>
  );
};

export default Scope;

/**
 * @param {string} a
 * @param {any} s
 */
const css = (a, s) => {
  const c = new String(a);
  // @ts-ignore html escaped string
  return (c.isEscaped = !0), (c.callbacks = s), c;
};

export { css };
