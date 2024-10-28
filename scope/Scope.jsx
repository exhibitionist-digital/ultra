// Scoped CSS component
// https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
// Influenced by https://x.com/dburles/status/1848236095173226873

/**
 * @param {string} [href] - Optional URL for stylesheet
 * @param {string} [css] - Optional CSS string for scoped styles
 * @param {import('react').ReactNode} children - Child elements
 * @returns {JSX.Element} Scoped component
 */
const Scope = (href, css, children) => {
  return (
    <ultra-scope>
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
